import { Batcher, ExtensionType, getMaxTexturesPerBatch } from 'pixi.js';
import { JOINT_TYPE } from '../const';
import { SmoothBatchGeometry } from './SmoothBatchGeometry';
import { SmoothShader } from './SmoothShader';

import type { BatchableMeshElement, BatchableQuadElement, BatcherOptions } from 'pixi.js';
import type { BatchableSmoothGraphics } from '../BatchableSmoothGraphics';

// Module singletons shared by all batchers of the same vertex format
const sharedShaders: Record<'plain' | 'textured', SmoothShader> = { plain: null, textured: null };

/** Source geometry stride: 10 floats per vertex */
const GEOM_STRIDE = 10;

/**
 * Batcher for smooth HHAA graphics. Registered as 'smooth'.
 *
 * Reads 10-float-per-vertex geometry data from BatchableSmoothGraphics elements
 * and writes 14-float-per-vertex output with pre-transformed positions and
 * per-vertex style data.
 *
 * See {@link SmoothTexturedBatcher} for the textured variant.
 * @category rendering
 * @advanced
 */
export class SmoothBatcher extends Batcher
{
    /** @ignore */
    public static extension: { type: readonly ExtensionType[]; name: string } = {
        type: [
            ExtensionType.Batcher,
        ],
        name: 'smooth',
    };

    public geometry = new SmoothBatchGeometry(this.textured);
    public shader: SmoothShader;

    public name: string = SmoothBatcher.extension.name;
    protected vertexSize = this.textured ? 20 : 14;

    constructor(options?: BatcherOptions)
    {
        super(options);

        this.shader = this._getSharedShader(options?.maxTextures ?? getMaxTexturesPerBatch());
    }

    /** Whether this batcher writes the texture coordinate matrix (20 floats per vertex). */
    public get textured(): boolean
    {
        return false;
    }

    /**
     * Pack 10-float source geometry into 14-float output with transform, style, and color.
     * @param element - Smooth graphics batchable element
     * @param float32View - Output float32 view
     * @param uint32View - Output uint32 view
     * @param index - Starting float offset in output
     * @param textureId - Texture slot ID
     */
    public packAttributes(
        element: BatchableMeshElement,
        float32View: Float32Array,
        uint32View: Uint32Array,
        index: number,
        textureId: number,
    ): void
    {
        const smoothElement = element as unknown as BatchableSmoothGraphics;
        const wt = smoothElement.transform;
        const a = wt.a;
        const b = wt.b;
        const c = wt.c;
        const d = wt.d;
        const tx = wt.tx;
        const ty = wt.ty;

        const srcFloats = smoothElement.geometryData.vertices;
        const offset = smoothElement.attributeOffset;
        const count = smoothElement.attributeSize;

        const elementScale = smoothElement.pixelLine
            ? 1
            : Math.sqrt(Math.abs((a * d) - (b * c)));
        const effectiveLineWidth = smoothElement.lineWidth * elementScale;

        // Pack alignment + pixelLine into a single float:
        // integer part = 0 (pixelLine/no-scale) or 1 (normal scale)
        // fractional part = alignment (0 to <1)
        // (alignment has to stay in [0, 1) so that it doesn't change the integer part)
        const stylePacked = (smoothElement.pixelLine ? 0 : 1) + Math.max(0, Math.min(smoothElement.alignment, 0.999));

        const argb = smoothElement.color;
        const textureIdAndRound = (textureId << 16) | (smoothElement.roundPixels & 0xFFFF);

        // The shader maps positions back to the space of the packed vertices (which are already
        // transformed here), so the texture matrix has to be combined with the inverse transform
        const textured = this.textured;
        let ua = 0;
        let ub = 0;
        let uc = 0;
        let ud = 0;
        let utx = 0;
        let uty = 0;

        // Elements without texture have no uv matrix: they can be packed by this batcher when they are in the
        // same non-batched context as textured ones, and their texture coordinates don't matter (Texture.WHITE)
        if (textured && smoothElement.uvMatrix)
        {
            const m = smoothElement.uvMatrix;
            const det = (a * d) - (b * c);
            const ia = d / det;
            const ib = -b / det;
            const ic = -c / det;
            const id = a / det;
            const itx = ((c * ty) - (d * tx)) / det;
            const ity = ((b * tx) - (a * ty)) / det;

            ua = (m.a * ia) + (m.c * ib);
            ub = (m.b * ia) + (m.d * ib);
            uc = (m.a * ic) + (m.c * id);
            ud = (m.b * ic) + (m.d * id);
            utx = (m.a * itx) + (m.c * ity) + m.tx;
            uty = (m.b * itx) + (m.d * ity) + m.ty;
        }

        for (let i = 0; i < count; i++)
        {
            const srcBase = (offset + i) * GEOM_STRIDE;

            const prevX = srcFloats[srcBase];
            const prevY = srcFloats[srcBase + 1];

            float32View[index] = (a * prevX) + (c * prevY) + tx;
            float32View[index + 1] = (b * prevX) + (d * prevY) + ty;

            const p1x = srcFloats[srcBase + 2];
            const p1y = srcFloats[srcBase + 3];

            float32View[index + 2] = (a * p1x) + (c * p1y) + tx;
            float32View[index + 3] = (b * p1x) + (d * p1y) + ty;

            const p2x = srcFloats[srcBase + 4];
            const p2y = srcFloats[srcBase + 5];

            float32View[index + 4] = (a * p2x) + (c * p2y) + tx;
            float32View[index + 5] = (b * p2x) + (d * p2y) + ty;

            const nextX = srcFloats[srcBase + 6];
            const nextY = srcFloats[srcBase + 7];

            const joint = Math.floor(srcFloats[srcBase + 9] / 16) & 31;

            if (joint >= JOINT_TYPE.FILL_EXPAND)
            {
                // For FILL_EXPAND vertices aNext is the bisector vector, not a point:
                // rotate it without translation, and keep its local length like the non-batched shader does
                const vx = (a * nextX) + (c * nextY);
                const vy = (b * nextX) + (d * nextY);
                const vLen = Math.sqrt((vx * vx) + (vy * vy));
                const k = vLen > 0 ? Math.sqrt((nextX * nextX) + (nextY * nextY)) / vLen : 0;

                float32View[index + 6] = vx * k;
                float32View[index + 7] = vy * k;
            }
            else
            {
                float32View[index + 6] = (a * nextX) + (c * nextY) + tx;
                float32View[index + 7] = (b * nextX) + (d * nextY) + ty;
            }

            float32View[index + 8] = srcFloats[srcBase + 8] * elementScale;
            float32View[index + 9] = srcFloats[srcBase + 9];

            float32View[index + 10] = effectiveLineWidth;
            float32View[index + 11] = stylePacked;
            uint32View[index + 12] = argb;
            uint32View[index + 13] = textureIdAndRound;

            if (textured)
            {
                float32View[index + 14] = ua;
                float32View[index + 15] = uc;
                float32View[index + 16] = utx;
                float32View[index + 17] = ub;
                float32View[index + 18] = ud;
                float32View[index + 19] = uty;
                index += 20;
            }
            else
            {
                index += 14;
            }
        }
    }

    /**
     * Smooth graphics never use quad packing, so this is a no-op.
     * @param _element - unused
     * @param _float32View - unused
     * @param _uint32View - unused
     * @param _index - unused
     * @param _textureId - unused
     */
    public packQuadAttributes(
        _element: BatchableQuadElement,
        _float32View: Float32Array,
        _uint32View: Uint32Array,
        _index: number,
        _textureId: number,
    ): void
    {
        // Smooth graphics are mesh-based only
    }

    /**
     * Updates the maximum number of textures used in the shader.
     * @param maxTextures - new max textures
     * @internal
     */
    public _updateMaxTextures(maxTextures: number): void
    {
        if (this.shader.maxTextures === maxTextures) return;
        this.shader = this._getSharedShader(maxTextures);
    }

    private _getSharedShader(maxTextures: number): SmoothShader
    {
        const key = this.textured ? 'textured' : 'plain';
        let shader = sharedShaders[key];

        if (!shader || shader.maxTextures !== maxTextures)
        {
            // Don't destroy the old shader; other batchers may still reference it.
            // It will be GC'd when no references remain.
            shader = sharedShaders[key] = new SmoothShader(maxTextures, false, this.textured);
        }

        return shader;
    }

    public override destroy(): void
    {
        this.shader = null;
        super.destroy();
    }
}

/**
 * Textured variant of {@link SmoothBatcher}, registered as 'smoothTextured'.
 *
 * Adds a per-vertex texture coordinate matrix (20 floats per vertex), so that texture,
 * gradient and pattern fills don't make the vertices of plain colored graphics bigger.
 * @category rendering
 * @advanced
 */
export class SmoothTexturedBatcher extends SmoothBatcher
{
    /** @ignore */
    public static override extension: { type: readonly ExtensionType[]; name: string } = {
        type: [
            ExtensionType.Batcher,
        ],
        name: 'smoothTextured',
    };

    public override name: string = SmoothTexturedBatcher.extension.name;

    public override get textured(): boolean
    {
        return true;
    }
}
