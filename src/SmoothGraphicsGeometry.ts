import {
    Buffer,
    Color,
    Geometry,
    Matrix,
    Point,
    SHAPES,
    Texture,
    TYPES,
    WRAP_MODES,
} from '@pixi/core';
import { Bounds } from '@pixi/display';
import { BatchDrawCall, IGraphicsBatchSettings, matrixEquals } from './core/BatchDrawCall';
import { BatchPart } from './core/BatchPart';
import { BuildData } from './core/BuildData';
import { FillStyle } from './core/FillStyle';
import { LineStyle } from './core/LineStyle';
import { SegmentPacker } from './core/SegmentPacker';
import { SmoothGraphicsData } from './core/SmoothGraphicsData';
import { FILL_COMMANDS } from './shapes';

import type { Circle, Ellipse, IPointData, Polygon, Rectangle, RoundedRectangle } from '@pixi/core';

/*
 * Complex shape type
 * @todo Move to Math shapes
 */
export type IShape = Circle | Ellipse | Polygon | Rectangle | RoundedRectangle;

export const BATCH_POOL: Array<BatchPart> = [];
export const DRAW_CALL_POOL: Array<BatchDrawCall> = [];

const tmpPoint = new Point();
const tmpBounds = new Bounds();

/**
 * @memberof PIXI.smooth
 */
export class SmoothGraphicsGeometry extends Geometry
{
    public static BATCHABLE_SIZE = 100;

    public boundsPadding: number;

    indicesUint16: Uint16Array | Uint32Array = null;
    batchable: boolean;

    buildData: BuildData;

    get points()
    {
        return this.buildData.verts;
    }

    get closePointEps()
    {
        return this.buildData.closePointEps;
    }

    graphicsData: Array<SmoothGraphicsData>;
    drawCalls: Array<BatchDrawCall>;
    batchDirty: number;
    batches: Array<BatchPart>;
    packer: SegmentPacker;
    packSize: number;
    pack32index: boolean;
    strideFloats: number;

    protected dirty: number;
    protected cacheDirty: number;
    protected clearDirty: number;
    protected shapeBuildIndex: number;
    protected shapeBatchIndex: number;
    protected _bounds: Bounds;
    protected boundsDirty: number;

    _buffer: Buffer;
    _indexBuffer: Buffer;
    _bufferFloats: Float32Array;
    _bufferUint: Uint32Array;

    initAttributes(_static: boolean)
    {
        this._buffer = new Buffer(null, _static, false);
        this._bufferFloats = new Float32Array();
        this._bufferUint = new Uint32Array();

        this._indexBuffer = new Buffer(null, _static, true);
        this.addAttribute('aPrev', this._buffer, 2, false, TYPES.FLOAT)
            .addAttribute('aPoint1', this._buffer, 2, false, TYPES.FLOAT)
            .addAttribute('aPoint2', this._buffer, 2, false, TYPES.FLOAT)
            .addAttribute('aNext', this._buffer, 2, false, TYPES.FLOAT)
            .addAttribute('aTravel', this._buffer, 1, false, TYPES.FLOAT)
            // number of vertex
            .addAttribute('aVertexJoint', this._buffer, 1, false, TYPES.FLOAT)
            // line width, alignment
            .addAttribute('aStyleId', this._buffer, 1, false, TYPES.FLOAT)
            // the usual
            .addAttribute('aColor', this._buffer, 4, true, TYPES.UNSIGNED_BYTE)
            .addIndex(this._indexBuffer);

        this.strideFloats = 12;
    }

    constructor()
    {
        super();

        this.initAttributes(false);

        this.buildData = new BuildData();

        this.graphicsData = [];

        this.dirty = 0;

        this.batchDirty = -1;

        this.cacheDirty = -1;

        this.clearDirty = 0;

        this.drawCalls = [];

        this.batches = [];

        this.shapeBuildIndex = 0;

        this.shapeBatchIndex = 0;

        this._bounds = new Bounds();

        this.boundsDirty = -1;

        this.boundsPadding = 0;

        this.batchable = false;

        this.indicesUint16 = null;

        this.packer = null;
        this.packSize = 0;
        this.pack32index = null;
    }

    public checkInstancing(instanced: boolean, allow32Indices: boolean)
    {
        if (this.packer)
        {
            return;
        }
        this.packer = new SegmentPacker();
        this.pack32index = allow32Indices;
    }

    /**
     * Get the current bounds of the graphic geometry.
     *
     * @member {PIXI.Bounds}
     * @readonly
     */
    public get bounds(): Bounds
    {
        if (this.boundsDirty !== this.dirty)
        {
            this.boundsDirty = this.dirty;
            this.calculateBounds();
        }

        return this._bounds;
    }

    /**
     * Call if you changed graphicsData manually.
     * Empties all batch buffers.
     */
    protected invalidate(): void
    {
        this.boundsDirty = -1;
        this.dirty++;
        this.batchDirty++;
        this.shapeBuildIndex = 0;
        this.shapeBatchIndex = 0;
        this.packSize = 0;

        this.buildData.clear();

        for (let i = 0; i < this.drawCalls.length; i++)
        {
            this.drawCalls[i].clear();
            DRAW_CALL_POOL.push(this.drawCalls[i]);
        }

        this.drawCalls.length = 0;

        for (let i = 0; i < this.batches.length; i++)
        {
            const batchPart = this.batches[i];

            batchPart.reset();
            BATCH_POOL.push(batchPart);
        }

        this.batches.length = 0;
    }

    public clear(): SmoothGraphicsGeometry
    {
        if (this.graphicsData.length > 0)
        {
            this.invalidate();
            this.clearDirty++;
            this.graphicsData.length = 0;
        }

        return this;
    }

    public drawShape(
        shape: IShape,
        fillStyle: FillStyle = null,
        lineStyle: LineStyle = null,
        matrix: Matrix = null): SmoothGraphicsGeometry
    {
        const data = new SmoothGraphicsData(shape, fillStyle, lineStyle, matrix);

        this.graphicsData.push(data);
        this.dirty++;

        return this;
    }

    public drawHole(shape: IShape, matrix: Matrix = null): SmoothGraphicsGeometry
    {
        if (!this.graphicsData.length)
        {
            return null;
        }

        const data = new SmoothGraphicsData(shape, null, null, matrix);

        const lastShape = this.graphicsData[this.graphicsData.length - 1];

        data.lineStyle = lastShape.lineStyle;

        lastShape.holes.push(data);

        this.dirty++;

        return this;
    }

    public destroy(): void
    {
        super.destroy();

        // destroy each of the SmoothGraphicsData objects
        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            this.graphicsData[i].destroy();
        }

        this.buildData.destroy();
        this.buildData = null;
        this.indexBuffer.destroy();
        this.indexBuffer = null;
        this.graphicsData.length = 0;
        this.graphicsData = null;
        this.drawCalls.length = 0;
        this.drawCalls = null;
        this.batches.length = 0;
        this.batches = null;
        this._bounds = null;
    }

    /**
     * Check to see if a point is contained within this geometry.
     *
     * @param {PIXI.IPointData} point - Point to check if it's contained.
     * @return {Boolean} `true` if the point is contained within geometry.
     */
    public containsPoint(point: IPointData): boolean
    {
        const graphicsData = this.graphicsData;

        for (let i = 0; i < graphicsData.length; ++i)
        {
            const data = graphicsData[i];

            if (!data.fillStyle.visible)
            {
                continue;
            }

            // only deal with fills..
            if (data.shape)
            {
                if (data.matrix)
                {
                    data.matrix.applyInverse(point, tmpPoint);
                }
                else
                {
                    tmpPoint.copyFrom(point);
                }

                if (data.shape.contains(tmpPoint.x, tmpPoint.y))
                {
                    let hitHole = false;

                    if (data.holes)
                    {
                        for (let i = 0; i < data.holes.length; i++)
                        {
                            const hole = data.holes[i];

                            if (hole.shape.contains(tmpPoint.x, tmpPoint.y))
                            {
                                hitHole = true;
                                break;
                            }
                        }
                    }

                    if (!hitHole)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    updatePoints(): void
    {
        // do nothing
    }

    updateBufferSize(): void
    {
        this._buffer.update(new Float32Array());
    }

    updateBuild(): void
    {
        const { graphicsData, buildData } = this;
        const len = graphicsData.length;

        for (let i = this.shapeBuildIndex; i < len; i++)
        {
            const data = graphicsData[i];

            data.strokeStart = 0;
            data.strokeLen = 0;
            data.fillStart = 0;
            data.fillLen = 0;
            const { fillStyle, lineStyle, holes } = data;

            if (!fillStyle.visible && !lineStyle.visible)
            {
                continue;
            }

            const command = FILL_COMMANDS[data.type];

            data.clearPath();

            command.path(data, buildData);
            if (data.matrix)
            {
                this.transformPoints(data.points, data.matrix);
            }

            data.clearBuild();
            if (data.points.length <= 2)
            {
                continue;
            }
            if (fillStyle.visible || lineStyle.visible)
            {
                this.processHoles(holes);
            }
            if (fillStyle.visible)
            {
                data.fillAA = (data.fillStyle as any).smooth
                    && data.fillStyle.texture === Texture.WHITE
                    && holes.length === 0
                    && !(data.closeStroke
                    && data.lineStyle.visible
                    && !data.lineStyle.shader
                    && data.lineStyle.alpha >= 0.99
                    && data.lineStyle.width * Math.min(data.lineStyle.alignment, 1 - data.lineStyle.alignment) >= 0.495);

                data.fillStart = buildData.joints.length;

                if (holes.length)
                {
                    FILL_COMMANDS[SHAPES.POLY].fill(data, buildData);
                }
                else
                {
                    command.fill(data, buildData);
                }

                data.fillLen = buildData.joints.length - data.fillStart;
            }
            if (lineStyle.visible)
            {
                data.strokeStart = buildData.joints.length;
                command.line(data, buildData);
                for (let i = 0; i < holes.length; i++)
                {
                    const hole = holes[i];

                    FILL_COMMANDS[hole.type].line(hole, buildData);
                }
                data.strokeLen = buildData.joints.length - data.strokeStart;
            }
        }
        this.shapeBuildIndex = len;
    }

    updateBatches(shaderSettings?: IGraphicsBatchSettings): void
    {
        if (!this.graphicsData.length)
        {
            this.batchable = true;

            return;
        }
        this.updateBuild();

        if (!this.validateBatching())
        {
            return;
        }

        const { buildData, graphicsData } = this;
        const len = graphicsData.length;

        this.cacheDirty = this.dirty;

        let batchPart: BatchPart = null;

        let currentStyle = null;

        if (this.batches.length > 0)
        {
            batchPart = this.batches[this.batches.length - 1];
            currentStyle = batchPart.style;
        }

        for (let i = this.shapeBatchIndex; i < len; i++)
        {
            const data = graphicsData[i];
            const fillStyle = data.fillStyle;
            const lineStyle = data.lineStyle;

            if (data.matrix)
            {
                this.transformPoints(data.points, data.matrix);
            }
            if (!fillStyle.visible && !lineStyle.visible)
            {
                continue;
            }
            for (let j = 0; j < 2; j++)
            {
                const style = (j === 0) ? fillStyle : lineStyle;

                if (!style.visible) continue;

                const nextTexture = style.texture.baseTexture;
                const attribOld = buildData.vertexSize;
                const indexOld = buildData.indexSize;

                nextTexture.wrapMode = WRAP_MODES.REPEAT;
                if (j === 0)
                {
                    this.packer.updateBufferSize(data.fillStart, data.fillLen, data.triangles.length, buildData);
                }
                else
                {
                    this.packer.updateBufferSize(data.strokeStart, data.strokeLen, data.triangles.length, buildData);
                }

                const attribSize = buildData.vertexSize;

                if (attribSize === attribOld) continue;
                // close batch if style is different
                if (batchPart && !this._compareStyles(currentStyle, style))
                {
                    batchPart.end(indexOld, attribOld);
                    batchPart = null;
                }
                // spawn new batch if its first batch or previous was closed
                if (!batchPart)
                {
                    batchPart = BATCH_POOL.pop() || new BatchPart();
                    batchPart.begin(style, indexOld, attribOld);
                    this.batches.push(batchPart);
                    currentStyle = style;
                }

                if (j === 0)
                {
                    batchPart.jointEnd = data.fillStart + data.fillLen;
                }
                else
                {
                    batchPart.jointEnd = data.strokeStart + data.strokeLen;
                }
            }
        }
        this.shapeBatchIndex = len;

        if (batchPart)
        {
            batchPart.end(buildData.indexSize, buildData.vertexSize);
        }

        if (this.batches.length === 0)
        {
            // there are no visible styles in SmoothGraphicsData
            // its possible that someone wants Graphics just for the bounds
            this.batchable = true;

            return;
        }

        // TODO make this a const..
        this.batchable = this.isBatchable();

        if (this.batchable)
        {
            this.packBatches();
        }
        else
        {
            this.buildDrawCalls(shaderSettings);
            this.updatePack();
        }
    }

    updatePack()
    {
        const { vertexSize, indexSize } = this.buildData;

        if (this.packSize === vertexSize)
        {
            return;
        }

        const { strideFloats, packer, buildData, batches } = this;
        const buffer = this._buffer;
        const index = this._indexBuffer;
        const floatsSize = vertexSize * strideFloats;

        if (buffer.data.length !== floatsSize)
        {
            const arrBuf = new ArrayBuffer(floatsSize * 4);

            this._bufferFloats = new Float32Array(arrBuf);
            this._bufferUint = new Uint32Array(arrBuf);
            buffer.data = this._bufferFloats;
        }
        if (index.data.length !== indexSize)
        {
            if (vertexSize > 0xffff && this.pack32index)
            {
                index.data = new Uint32Array(indexSize);
            }
            else
            {
                index.data = new Uint16Array(indexSize);
            }
        }

        packer.beginPack(buildData, this._bufferFloats, this._bufferUint, index.data as Uint16Array);

        let j = 0;

        for (let i = 0; i < this.graphicsData.length; i++)
        {
            const data = this.graphicsData[i];

            if (data.fillLen)
            {
                while (batches[j].jointEnd <= data.fillStart)
                {
                    j++;
                }
                packer.packInterleavedGeometry(data.fillStart, data.fillLen, data.triangles,
                    batches[j].styleId, batches[j].rgba);
            }
            if (data.strokeLen)
            {
                while (batches[j].jointEnd <= data.strokeStart)
                {
                    j++;
                }
                packer.packInterleavedGeometry(data.strokeStart, data.strokeLen, data.triangles,
                    batches[j].styleId, batches[j].rgba);
            }
        }

        buffer.update();
        index.update();
        this.packSize = vertexSize;
    }

    /**
     * Affinity check
     *
     * @param {PIXI.FillStyle | PIXI.LineStyle} styleA
     * @param {PIXI.FillStyle | PIXI.LineStyle} styleB
     */
    protected _compareStyles(styleA: FillStyle | LineStyle, styleB: FillStyle | LineStyle): boolean
    {
        if (!styleA || !styleB)
        {
            return false;
        }

        if (styleA.texture.baseTexture !== styleB.texture.baseTexture)
        {
            return false;
        }

        if (styleA.color + styleA.alpha !== styleB.color + styleB.alpha)
        {
            return false;
        }

        if (styleA.shader !== styleB.shader)
        {
            return false;
        }
        // TODO: propagate width for FillStyle
        if ((styleA as LineStyle).width !== (styleB as LineStyle).width)
        {
            return false;
        }
        if ((styleA as LineStyle).scaleMode !== (styleB as LineStyle).scaleMode)
        {
            return false;
        }
        if ((styleA as LineStyle).alignment !== (styleB as LineStyle).alignment)
        {
            return false;
        }

        const mat1 = styleA.matrix || Matrix.IDENTITY;
        const mat2 = styleB.matrix || Matrix.IDENTITY;

        return matrixEquals(mat1, mat2);
    }

    /**
     * Test geometry for batching process.
     *
     * @protected
     */
    protected validateBatching(): boolean
    {
        if (this.dirty === this.cacheDirty || !this.graphicsData.length)
        {
            return false;
        }

        for (let i = 0, l = this.graphicsData.length; i < l; i++)
        {
            const data = this.graphicsData[i];
            const fill = data.fillStyle;
            const line = data.lineStyle;

            if (fill && !fill.texture.baseTexture.valid) return false;
            if (line && !line.texture.baseTexture.valid) return false;
        }

        return true;
    }

    /**
     * Offset the indices so that it works with the batcher.
     *
     * @protected
     */
    protected packBatches(): void
    {
        this.batchDirty++;
        const batches = this.batches;

        for (let i = 0, l = batches.length; i < l; i++)
        {
            const batch = batches[i];

            for (let j = 0; j < batch.size; j++)
            {
                const index = batch.start + j;

                this.indicesUint16[index] = this.indicesUint16[index] - batch.attribStart;
            }
        }
    }

    protected isBatchable(): boolean
    {
        return false;

        // prevent heavy mesh batching
        // if (this.points.length > 0xffff * 2) {
        //     return false;
        // }
        //
        // const batches = this.batches;
        //
        // for (let i = 0; i < batches.length; i++) {
        //     if ((batches[i].style as LineStyle).native) {
        //         return false;
        //     }
        // }
        //
        // return (this.points.length < SmoothGraphicsGeometry.BATCHABLE_SIZE * 2);
    }

    /**
     * Converts intermediate batches data to drawCalls.
     *
     * @protected
     */
    protected buildDrawCalls(shaderSettings?: IGraphicsBatchSettings)
    {
        for (let i = 0; i < this.drawCalls.length; i++)
        {
            this.drawCalls[i].clear();
            DRAW_CALL_POOL.push(this.drawCalls[i]);
        }

        this.drawCalls.length = 0;

        let currentGroup = DRAW_CALL_POOL.pop() || new BatchDrawCall();

        currentGroup.begin(shaderSettings, null);

        let index = 0;

        this.drawCalls.push(currentGroup);

        for (let i = 0; i < this.batches.length; i++)
        {
            const batchData = this.batches[i];
            const style = batchData.style as LineStyle;

            if (batchData.attribSize === 0)
            {
                // I don't know how why do we have size=0 sometimes
                continue;
            }

            let styleId = -1;
            const mat = style.getTextureMatrix();

            if (currentGroup.check(style.shader))
            {
                styleId = currentGroup.add(style.texture, mat,
                    style.width, style.alignment || 0, style.packLineScale());
            }
            if (styleId < 0)
            {
                currentGroup = DRAW_CALL_POOL.pop() || new BatchDrawCall();
                this.drawCalls.push(currentGroup);
                currentGroup.begin(shaderSettings, style.shader);
                currentGroup.start = index;
                styleId = currentGroup.add(style.texture, mat,
                    style.width, style.alignment || 0, style.packLineScale());
            }
            currentGroup.size += batchData.size;
            index += batchData.size;

            const { color, alpha } = style;
            const bgr = Color.shared
                .setValue(color)
                .toLittleEndianNumber();

            batchData.rgba = Color.shared
                .setValue(bgr)
                .toPremultiplied(alpha);
            batchData.styleId = styleId;
        }
    }

    protected processHoles(holes: Array<SmoothGraphicsData>): void
    {
        for (let i = 0; i < holes.length; i++)
        {
            const hole = holes[i];
            const command = FILL_COMMANDS[hole.type];

            hole.clearPath();

            command.path(hole, this.buildData);

            if (hole.matrix)
            {
                this.transformPoints(hole.points, hole.matrix);
            }
        }
    }

    /**
     * Update the local bounds of the object. Expensive to use performance-wise.
     *
     * @protected
     */
    protected calculateBounds(): void
    {
        const bounds = this._bounds;
        const sequenceBounds = tmpBounds;
        let curMatrix = Matrix.IDENTITY;

        this._bounds.clear();
        sequenceBounds.clear();

        for (let i = 0; i < this.graphicsData.length; i++)
        {
            const data = this.graphicsData[i];
            const shape = data.shape;
            const type = data.type;
            const lineStyle = data.lineStyle;
            const nextMatrix = data.matrix || Matrix.IDENTITY;
            let lineWidth = 0.0;

            if (lineStyle && lineStyle.visible)
            {
                lineWidth = lineStyle.width;

                if (type !== SHAPES.POLY || data.fillStyle.visible)
                {
                    lineWidth *= Math.max(0, lineStyle.alignment);
                }
                else
                {
                    lineWidth *= Math.max(lineStyle.alignment, 1 - lineStyle.alignment);
                }
            }

            if (curMatrix !== nextMatrix)
            {
                if (!sequenceBounds.isEmpty())
                {
                    bounds.addBoundsMatrix(sequenceBounds, curMatrix);
                    sequenceBounds.clear();
                }
                curMatrix = nextMatrix;
            }

            if (type === SHAPES.RECT || type === SHAPES.RREC)
            {
                const rect = shape as Rectangle | RoundedRectangle;

                sequenceBounds.addFramePad(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height,
                    lineWidth, lineWidth);
            }
            else if (type === SHAPES.CIRC)
            {
                const circle = shape as Circle;

                sequenceBounds.addFramePad(circle.x, circle.y, circle.x, circle.y,
                    circle.radius + lineWidth, circle.radius + lineWidth);
            }
            else if (type === SHAPES.ELIP)
            {
                const ellipse = shape as Ellipse;

                sequenceBounds.addFramePad(ellipse.x, ellipse.y, ellipse.x, ellipse.y,
                    ellipse.width + lineWidth, ellipse.height + lineWidth);
            }
            else
            {
                const poly = shape as Polygon;
                // adding directly to the bounds

                bounds.addVerticesMatrix(curMatrix, (poly.points as any), 0, poly.points.length, lineWidth, lineWidth);
            }
        }

        if (!sequenceBounds.isEmpty())
        {
            bounds.addBoundsMatrix(sequenceBounds, curMatrix);
        }

        bounds.pad(this.boundsPadding, this.boundsPadding);
    }

    /**
     * Transform points using matrix.
     *
     * @protected
     * @param {number[]} points - Points to transform
     * @param {PIXI.Matrix} matrix - Transform matrix
     */
    protected transformPoints(points: Array<number>, matrix: Matrix): void
    {
        for (let i = 0; i < points.length / 2; i++)
        {
            const x = points[(i * 2)];
            const y = points[(i * 2) + 1];

            points[(i * 2)] = (matrix.a * x) + (matrix.c * y) + matrix.tx;
            points[(i * 2) + 1] = (matrix.b * x) + (matrix.d * y) + matrix.ty;
        }
    }
}
