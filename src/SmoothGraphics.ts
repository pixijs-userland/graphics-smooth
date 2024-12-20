import {
    Circle,
    Color,
    Ellipse,
    PI_2,
    Point,
    Polygon,
    Rectangle,
    RoundedRectangle,
    Matrix,
    SHAPES,
    utils,
    Texture,
    State,
    Renderer,
    Shader,
    BLEND_MODES,
    DRAW_MODES,
    MSAA_QUALITY,
} from '@pixi/core';

import { curves, Graphics, graphicsUtils, LINE_JOIN, LINE_CAP } from '@pixi/graphics';
import { SmoothGraphicsGeometry } from './SmoothGraphicsGeometry';
import { Container } from '@pixi/display';

import type { ColorSource, IShape, IPointData } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
import { IGraphicsBatchSettings } from './core/BatchDrawCall';
import { FillStyle } from './core/FillStyle';
import { LINE_SCALE_MODE, LineStyle } from './core/LineStyle';
import { SmoothGraphicsShader } from './SmoothShader';
import { settings } from './settings';

const UnsmoothGraphics = Graphics;
const { BezierUtils, QuadraticUtils, ArcUtils } = graphicsUtils;

// a default shaders map used by graphics..
const DEFAULT_SHADERS: { [key: string]: Shader } = {};

export interface IFillStyleOptions
{
    color?: ColorSource;
    alpha?: number;
    texture?: Texture;
    matrix?: Matrix;
    smooth?: boolean;
    shader?: Shader;
}

export interface ILineStyleOptions extends IFillStyleOptions
{
    width?: number;
    alignment?: number;
    scaleMode?: LINE_SCALE_MODE;
    cap?: LINE_CAP;
    join?: LINE_JOIN;
    miterLimit?: number;
}

/**
 * @memberof PIXI.smooth
 */
export class SmoothGraphics extends Container
{
    public static readonly curves = curves;

    static _TEMP_POINT = new Point();

    public shader: Shader;
    public shaderSettings: IGraphicsBatchSettings;
    public pluginName: string;
    public currentPath: Polygon;

    protected batches: Array<any>;
    protected batchTint: number;
    protected batchDirty: number;
    protected vertexData: Float32Array;

    protected _fillStyle: FillStyle;
    protected _lineStyle: LineStyle;
    protected _matrix: Matrix;
    protected _holeMode: boolean;
    protected _transformID: number;
    protected _tintColor: Color;

    private state: State;
    private _geometry: SmoothGraphicsGeometry;

    public get geometry(): SmoothGraphicsGeometry
    {
        return this._geometry;
    }

    constructor(geometry: SmoothGraphicsGeometry = null)
    {
        super();

        this._geometry = geometry || new SmoothGraphicsGeometry();
        this._geometry.refCount++;

        this.shader = null;

        this.shaderSettings = {
            maxStyles: settings.SHADER_MAX_STYLES,
            maxTextures: settings.SHADER_MAX_TEXTURES,
            pixelLine: settings.PIXEL_LINE,
        };

        this.state = State.for2d();

        this._fillStyle = new FillStyle();

        this._lineStyle = new LineStyle();

        this._matrix = null;

        this._holeMode = false;

        this.currentPath = null;

        this.batches = [];

        this.batchTint = -1;

        this.batchDirty = -1;

        this.vertexData = null;

        this.pluginName = 'smooth';

        this._transformID = -1;

        // Set default
        this._tintColor = new Color(0xFFFFFF);
        this.blendMode = BLEND_MODES.NORMAL;
    }

    public clone(): SmoothGraphics
    {
        this.finishPoly();

        return new SmoothGraphics(this._geometry);
    }

    public set blendMode(value: BLEND_MODES)
    {
        this.state.blendMode = value;
    }

    public get blendMode(): BLEND_MODES
    {
        return this.state.blendMode;
    }

    public get tint(): ColorSource
    {
        return this._tintColor.value;
    }

    public set tint(value: ColorSource)
    {
        this._tintColor.setValue(value);
    }

    public get fill(): FillStyle
    {
        return this._fillStyle;
    }

    public get line(): LineStyle
    {
        return this._lineStyle;
    }

    public lineStyle(width: number, color?: ColorSource, alpha?: number, alignment?: number, scaleMode?: LINE_SCALE_MODE): this;

    public lineStyle(options?: ILineStyleOptions): this;

    public lineStyle(options: ILineStyleOptions | number = null,
        color: ColorSource = 0x0, alpha = 1, alignment = 0.5, scaleMode = settings.LINE_SCALE_MODE): this
    {
        // Support non-object params: (width, color, alpha, alignment, native)
        if (typeof options === 'number')
        {
            if (typeof scaleMode === 'boolean')
            {
                scaleMode = scaleMode ? LINE_SCALE_MODE.NONE : LINE_SCALE_MODE.NORMAL;
            }
            options = { width: options, color, alpha, alignment, scaleMode } as ILineStyleOptions;
        }
        else
        {
            const native: boolean = (options as any).native;

            if (native !== undefined)
            {
                options.scaleMode = native ? LINE_SCALE_MODE.NONE : LINE_SCALE_MODE.NORMAL;
            }
        }

        return this.lineTextureStyle(options);
    }

    public lineTextureStyle(options: ILineStyleOptions): this
    {
        // Apply defaults
        options = Object.assign({
            width: 0,
            texture: Texture.WHITE,
            color: (options && options.texture) ? 0xFFFFFF : 0x0,
            alpha: 1,
            matrix: null,
            alignment: 0.5,
            native: false,
            cap: LINE_CAP.BUTT,
            join: LINE_JOIN.MITER,
            miterLimit: 10,
            shader: null,
            scaleMode: settings.LINE_SCALE_MODE,
        }, options);

        this.normalizeColor(options);

        if (this.currentPath)
        {
            this.startPoly();
        }

        const visible = options.width > 0 && options.alpha > 0;

        if (!visible)
        {
            this._lineStyle.reset();
        }
        else
        {
            if (options.matrix)
            {
                options.matrix = options.matrix.clone();
                options.matrix.invert();
            }

            Object.assign(this._lineStyle, { visible }, options);
        }

        return this;
    }

    protected startPoly(): void
    {
        if (this.currentPath)
        {
            const points = this.currentPath.points;
            const len = this.currentPath.points.length;

            if (len > 2)
            {
                this.drawShape(this.currentPath);
                this.currentPath = new Polygon();
                this.currentPath.closeStroke = false;
                this.currentPath.points.push(points[len - 2], points[len - 1]);
            }
        }
        else
        {
            this.currentPath = new Polygon();
            this.currentPath.closeStroke = false;
        }
    }

    finishPoly(): void
    {
        if (this.currentPath)
        {
            if (this.currentPath.points.length > 2)
            {
                this.drawShape(this.currentPath);
                this.currentPath = null;
            }
            else
            {
                this.currentPath.points.length = 0;
            }
        }
    }

    public moveTo(x: number, y: number): this
    {
        this.startPoly();
        this.currentPath.points[0] = x;
        this.currentPath.points[1] = y;

        return this;
    }

    public lineTo(x: number, y: number): this
    {
        if (!this.currentPath)
        {
            this.moveTo(0, 0);
        }

        // remove duplicates..
        const points = this.currentPath.points;
        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        if (fromX !== x || fromY !== y)
        {
            points.push(x, y);
        }

        return this;
    }

    protected _initCurve(x = 0, y = 0): void
    {
        if (this.currentPath)
        {
            if (this.currentPath.points.length === 0)
            {
                this.currentPath.points = [x, y];
            }
        }
        else
        {
            this.moveTo(x, y);
        }
    }

    public quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): this
    {
        this._initCurve();

        const points = this.currentPath.points;

        if (points.length === 0)
        {
            this.moveTo(0, 0);
        }

        QuadraticUtils.curveTo(cpX, cpY, toX, toY, points);

        return this;
    }

    public bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): this
    {
        this._initCurve();

        BezierUtils.curveTo(cpX, cpY, cpX2, cpY2, toX, toY, this.currentPath.points);

        return this;
    }

    public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this
    {
        this._initCurve(x1, y1);

        const points = this.currentPath.points;

        const result = ArcUtils.curveTo(x1, y1, x2, y2, radius, points);

        if (result)
        {
            const { cx, cy, radius, startAngle, endAngle, anticlockwise } = result;

            this.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
        }

        return this;
    }

    public arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise = false): this
    {
        if (startAngle === endAngle)
        {
            return this;
        }

        if (!anticlockwise && endAngle <= startAngle)
        {
            endAngle += PI_2;
        }
        else if (anticlockwise && startAngle <= endAngle)
        {
            startAngle += PI_2;
        }

        const sweep = endAngle - startAngle;

        if (sweep === 0)
        {
            return this;
        }

        const startX = cx + (Math.cos(startAngle) * radius);
        const startY = cy + (Math.sin(startAngle) * radius);
        const eps = this._geometry.closePointEps;

        // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.
        let points = this.currentPath ? this.currentPath.points : null;

        if (points)
        {
            // TODO: make a better fix.

            // We check how far our start is from the last existing point
            const xDiff = Math.abs(points[points.length - 2] - startX);
            const yDiff = Math.abs(points[points.length - 1] - startY);

            if (xDiff < eps && yDiff < eps)
            {
                // If the point is very close, we don't add it, since this would lead to artifacts
                // during tessellation due to floating point imprecision.
            }
            else
            {
                points.push(startX, startY);
            }
        }
        else
        {
            this.moveTo(startX, startY);
            points = this.currentPath.points;
        }

        ArcUtils.arc(startX, startY, cx, cy, radius, startAngle, endAngle, anticlockwise, points);

        return this;
    }

    public beginFill(color: ColorSource = 0, alpha = 1, smooth = false): this
    {
        return this.beginTextureFill({ texture: Texture.WHITE, color, alpha, smooth });
    }

    private normalizeColor(options: Pick<IFillStyleOptions, 'color' | 'alpha'>): void
    {
        const temp = Color.shared.setValue(options.color ?? 0);

        options.color = temp.toNumber();
        options.alpha ??= temp.alpha;
    }

    beginTextureFill(options?: IFillStyleOptions): this
    {
        // Apply defaults
        options = Object.assign({
            texture: Texture.WHITE,
            color: 0xFFFFFF,
            alpha: 1,
            matrix: null,
            smooth: false,
        }, options) as IFillStyleOptions;

        this.normalizeColor(options);

        if (this.currentPath)
        {
            this.startPoly();
        }

        const visible = options.alpha > 0;

        if (!visible)
        {
            this._fillStyle.reset();
        }
        else
        {
            if (options.matrix)
            {
                options.matrix = options.matrix.clone();
                options.matrix.invert();
            }

            Object.assign(this._fillStyle, { visible }, options);
        }

        return this;
    }

    public endFill(): this
    {
        this.finishPoly();

        this._fillStyle.reset();

        return this;
    }

    public drawRect(x: number, y: number, width: number, height: number): this
    {
        return this.drawShape(new Rectangle(x, y, width, height));
    }

    public drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): this
    {
        return this.drawShape(new RoundedRectangle(x, y, width, height, radius));
    }

    public drawCircle(x: number, y: number, radius: number): this
    {
        return this.drawShape(new Circle(x, y, radius));
    }

    public drawEllipse(x: number, y: number, width: number, height: number): this
    {
        return this.drawShape(new Ellipse(x, y, width, height));
    }

    public drawPolygon(...path: Array<number> | Array<IPointData>): this;
    public drawPolygon(path: Array<number> | Array<IPointData> | Polygon): this;

    public drawPolygon(...path: any[]): this
    {
        let points: Array<number> | Array<IPointData>;
        let closeStroke = true;// !!this._fillStyle;

        const poly = path[0] as Polygon;

        // check if data has points..
        if (poly.points)
        {
            closeStroke = poly.closeStroke;
            points = poly.points;
        }
        else if (Array.isArray(path[0]))
        {
            points = path[0];
        }
        else
        {
            points = path;
        }

        const shape = new Polygon(points);

        shape.closeStroke = closeStroke;

        this.drawShape(shape);

        return this;
    }

    public drawShape(shape: IShape): this
    {
        if (!this._holeMode)
        {
            this._geometry.drawShape(
                shape,
                this._fillStyle.clone(),
                this._lineStyle.clone(),
                this._matrix
            );
        }
        else
        {
            this._geometry.drawHole(shape, this._matrix);
        }

        return this;
    }

    public clear(): this
    {
        this._geometry.clear();
        this._lineStyle.reset();
        this._fillStyle.reset();

        this._boundsID++;
        this._matrix = null;
        this._holeMode = false;
        this.currentPath = null;

        return this;
    }

    public isFastRect(): boolean
    {
        const data = this._geometry.graphicsData;

        return data.length === 1
            && data[0].shape.type === SHAPES.RECT
            && !data[0].matrix
            && !data[0].holes.length
            && !(data[0].lineStyle.visible && data[0].lineStyle.width);
    }

    protected _renderCanvas(renderer: any): void
    {
        (UnsmoothGraphics.prototype as any)._renderCanvas.call(this, renderer);
    }

    protected _render(renderer: Renderer): void
    {
        this.finishPoly();

        const geometry = this._geometry;
        const hasuint32 = renderer.context.supports.uint32Indices;
        // batch part..
        // batch it!

        geometry.checkInstancing(renderer.geometry.hasInstance, hasuint32);

        geometry.updateBatches(this.shaderSettings);

        if (geometry.batchable)
        {
            if (this.batchDirty !== geometry.batchDirty)
            {
                this._populateBatches();
            }

            this._renderBatched(renderer);
        }
        else
        {
            // no batching...
            renderer.batch.flush();

            this._renderDirect(renderer);
        }
    }

    protected _populateBatches(): void
    {
        const geometry = this._geometry;
        const blendMode = this.blendMode;
        const len = geometry.batches.length;

        this.batchTint = -1;
        this._transformID = -1;
        this.batchDirty = geometry.batchDirty;
        this.batches.length = len;

        this.vertexData = new Float32Array(geometry.points);

        for (let i = 0; i < len; i++)
        {
            const gI = geometry.batches[i];
            const color = gI.style.color;
            const vertexData = new Float32Array(this.vertexData.buffer,
                gI.attribStart * 4 * 2,
                gI.attribSize * 2);

            // const uvs = new Float32Array(geometry.uvsFloat32.buffer,
            //     gI.attribStart * 4 * 2,
            //     gI.attribSize * 2);

            // const indices = new Uint16Array(geometry.indicesUint16.buffer,
            //     gI.start * 2,
            //     gI.size);

            const batch = {
                vertexData,
                blendMode,
                // indices,
                // uvs,
                _batchRGB: utils.hex2rgb(color) as Array<number>,
                _tintRGB: color,
                _texture: gI.style.texture,
                alpha: gI.style.alpha,
                worldAlpha: 1
            };

            this.batches[i] = batch;
        }
    }

    protected _renderBatched(renderer: Renderer): void
    {
        if (!this.batches.length)
        {
            return;
        }

        renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);

        this.calculateVertices();
        this.calculateTints();

        for (let i = 0, l = this.batches.length; i < l; i++)
        {
            const batch = this.batches[i];

            batch.worldAlpha = this.worldAlpha * batch.alpha;

            renderer.plugins[this.pluginName].render(batch);
        }
    }

    protected _renderDirect(renderer: Renderer): void
    {
        const directShader = this._resolveDirectShader(renderer);
        let shader: Shader = directShader;

        const geometry = this._geometry;
        const worldAlpha = this.worldAlpha;
        const uniforms = shader.uniforms;
        const drawCalls = geometry.drawCalls;

        // lets set the transfomr
        uniforms.translationMatrix = this.transform.worldTransform;

        // and then lets set the tint..
        Color.shared.setValue(this._tintColor)
            .premultiply(worldAlpha)
            .toArray(uniforms.tint);

        uniforms.resolution = renderer.renderTexture.current
            ? renderer.renderTexture.current.resolution : renderer.resolution;

        const projTrans = renderer.projection.transform;

        if (projTrans)
        {
            // only uniform scale is supported!
            const scale = Math.sqrt((projTrans.a * projTrans.a) + (projTrans.b * projTrans.b));

            uniforms.resolution *= scale;
        }

        const multisample = renderer.renderTexture.current
            ? renderer.renderTexture.current.multisample : renderer.multisample;

        uniforms.expand = (multisample !== MSAA_QUALITY.NONE ? 2 : 1) / uniforms.resolution;

        // the first draw call, we can set the uniforms of the shader directly here.

        // this means that we can tack advantage of the sync function of pixi!
        // bind and sync uniforms..
        // there is a way to optimise this..
        renderer.shader.bind(shader);
        renderer.geometry.bind(geometry, shader);

        // set state..
        renderer.state.set(this.state);

        shader = null;
        // then render the rest of them...
        for (let i = 0, l = drawCalls.length; i < l; i++)
        {
            // TODO: refactor it to another class, that fills uniforms of this shader
            const drawCall = geometry.drawCalls[i];

            const shaderChange = shader !== drawCall.shader;

            if (shaderChange)
            {
                shader = drawCall.shader;
                if (shader)
                {
                    shader.uniforms.translationMatrix = this.transform.worldTransform;
                    if (shader.uniforms.tint)
                    {
                        shader.uniforms.tint[0] = uniforms.tint[0];
                        shader.uniforms.tint[1] = uniforms.tint[1];
                        shader.uniforms.tint[2] = uniforms.tint[2];
                        shader.uniforms.tint[3] = uniforms.tint[3];
                    }
                }
            }

            const { texArray, styleArray, size, start } = drawCall;
            const groupTextureCount = texArray.count;
            const shaderHere = shader || directShader;

            const texs = shaderHere.uniforms.styleTextureId;
            const mats = shaderHere.uniforms.styleMatrix;
            const lines = shaderHere.uniforms.styleLine;

            for (let i = 0; i < styleArray.count; i++)
            {
                texs[i] = styleArray.textureIds[i];
                lines[i * 2] = styleArray.lines[i * 2];
                lines[(i * 2) + 1] = styleArray.lines[(i * 2) + 1];
                const m = styleArray.matrices[i];

                mats[i * 6] = m.a;
                mats[(i * 6) + 1] = m.c;
                mats[(i * 6) + 2] = m.tx;
                mats[(i * 6) + 3] = m.b;
                mats[(i * 6) + 4] = m.d;
                mats[(i * 6) + 5] = m.ty;
            }
            const sizes = shaderHere.uniforms.samplerSize;

            for (let i = 0; i < groupTextureCount; i++)
            {
                sizes[i * 2] = texArray.elements[i].width;
                sizes[(i * 2) + 1] = texArray.elements[i].height;
            }

            renderer.shader.bind(shaderHere);
            if (shaderChange)
            {
                renderer.geometry.bind(geometry);
            }

            // TODO: bind styles!
            for (let j = 0; j < groupTextureCount; j++)
            {
                renderer.texture.bind(texArray.elements[j], j);
            }

            // bind the geometry...
            renderer.geometry.draw(DRAW_MODES.TRIANGLES, size, start);
        }
    }

    protected _resolveDirectShader(_renderer: Renderer): Shader
    {
        let shader = this.shader;

        const pluginName = this.pluginName;

        if (!shader)
        {
            if (!DEFAULT_SHADERS[pluginName])
            {
                DEFAULT_SHADERS[pluginName] = new SmoothGraphicsShader(this.shaderSettings);
            }
            shader = DEFAULT_SHADERS[pluginName];
        }

        return shader;
    }

    protected _calculateBounds(): void
    {
        this.finishPoly();

        const geometry = this._geometry;

        // skipping when graphics is empty, like a container
        if (!geometry.graphicsData.length)
        {
            return;
        }

        const { minX, minY, maxX, maxY } = geometry.bounds;

        this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
    }

    public containsPoint(point: IPointData): boolean
    {
        this.worldTransform.applyInverse(point, SmoothGraphics._TEMP_POINT);

        return this._geometry.containsPoint(SmoothGraphics._TEMP_POINT);
    }

    protected calculateTints(): void
    {
        if (this.batchTint !== this.tint)
        {
            this.batchTint = this._tintColor.toNumber();

            for (let i = 0; i < this.batches.length; i++)
            {
                const batch = this.batches[i];

                batch._tintRGB = Color.shared
                    .setValue(this._tintColor)
                    .multiply(batch._batchRGB)
                    .toLittleEndianNumber();
            }
        }
    }

    protected calculateVertices(): void
    {
        const wtID = this.transform._worldID;

        if (this._transformID === wtID)
        {
            return;
        }

        this._transformID = wtID;

        const wt = this.transform.worldTransform;
        const a = wt.a;
        const b = wt.b;
        const c = wt.c;
        const d = wt.d;
        const tx = wt.tx;
        const ty = wt.ty;

        const data = this._geometry.points;// batch.vertexDataOriginal;
        const vertexData = this.vertexData;

        let count = 0;

        for (let i = 0; i < data.length; i += 2)
        {
            const x = data[i];
            const y = data[i + 1];

            vertexData[count++] = (a * x) + (c * y) + tx;
            vertexData[count++] = (d * y) + (b * x) + ty;
        }
    }

    public closePath(): this
    {
        const currentPath = this.currentPath;

        if (currentPath)
        {
            // we don't need to add extra point in the end because buildLine will take care of that
            currentPath.closeStroke = true;
        }

        return this;
    }

    public setMatrix(matrix: Matrix): this
    {
        this._matrix = matrix;

        return this;
    }

    public beginHole(): this
    {
        this.finishPoly();
        this._holeMode = true;

        return this;
    }

    public endHole(): this
    {
        this.finishPoly();
        this._holeMode = false;

        return this;
    }

    public destroy(options?: IDestroyOptions | boolean): void
    {
        this._geometry.refCount--;
        if (this._geometry.refCount === 0)
        {
            this._geometry.dispose();
        }

        this._matrix = null;
        this.currentPath = null;
        this._lineStyle.destroy();
        this._lineStyle = null;
        this._fillStyle.destroy();
        this._fillStyle = null;
        this._geometry = null;
        this.shader = null;
        this.vertexData = null;
        this.batches.length = 0;
        this.batches = null;

        super.destroy(options);
    }
}
