import { BaseTexture, BatchTextureArray, BLEND_MODES, Matrix, Shader, Texture } from '@pixi/core';
/**
 * @memberof PIXI.smooth
 */
export interface IGraphicsBatchSettings
{
    maxStyles: number;
    maxTextures: number;
    pixelLine: number;
}

/**
 * @memberof PIXI.smooth
 */
export function matrixEquals(th: Matrix, matrix: Matrix, eps = 1e-3)
{
    return th === matrix || (Math.abs(th.a - matrix.a) < eps
        && Math.abs(th.b - matrix.b) < eps
        && Math.abs(th.c - matrix.c) < eps
        && Math.abs(th.d - matrix.d) < eps
        && Math.abs(th.tx - matrix.tx) < eps
        && Math.abs(th.ty - matrix.ty) < eps);
}

/**
 * @memberof PIXI.smooth
 */
export class BatchStyleArray
{
    public textureIds: number[];
    public matrices: Matrix[];
    public lines: number[];
    public count: number;

    constructor()
    {
        this.textureIds = [];
        this.matrices = [];
        this.lines = [];
        this.count = 0;
        // TODO: mapCoord for atlas cases
        // TODO: gradients?
    }

    clear(): void
    {
        for (let i = 0; i < this.count; i++)
        {
            this.textureIds[i] = null;
            this.matrices[i] = null;
        }
        this.count = 0;
    }

    add(textureId: number, matrix: Matrix,
        lineWidth: number, lineAlignment: number, lineScaleMode: number,
        settings: IGraphicsBatchSettings): number
    {
        const { textureIds, matrices, lines, count } = this;

        textureId = (textureId * 4) + lineScaleMode;
        for (let i = 0; i < count; i++)
        {
            if (lines[i * 2] === lineWidth && lines[(i * 2) + 1] === lineAlignment
                && textureIds[i] === textureId && (matrixEquals(matrices[i], matrix)))
            {
                return i;
            }
        }
        if (count >= settings.maxStyles)
        {
            return -1;
        }
        textureIds[count] = textureId;
        matrices[count] = matrix;
        lines[count * 2] = lineWidth;
        lines[(count * 2) + 1] = lineAlignment;
        this.count++;

        return count;
    }
}

/**
 * @memberof PIXI.smooth
 */
export class BatchDrawCall
{
    texArray: BatchTextureArray;
    styleArray: BatchStyleArray;
    blend: BLEND_MODES;
    start: number;
    size: number;
    data: any;
    shader: Shader;
    TICK: number;
    settings: IGraphicsBatchSettings;

    constructor()
    {
        this.texArray = new BatchTextureArray();
        this.styleArray = new BatchStyleArray();
        this.shader = null;
        this.blend = BLEND_MODES.NORMAL;

        this.start = 0;
        this.size = 0;
        this.TICK = 0; // for filling textures
        this.settings = null;
        /**
         * data for uniforms or custom webgl state
         * @member {object}
         */
        this.data = null;
    }

    clear()
    {
        this.texArray.clear();
        this.styleArray.clear();
        this.settings = null;
        this.data = null;
        this.shader = null;
    }

    begin(settings: IGraphicsBatchSettings, shader: Shader)
    {
        this.TICK = ++BaseTexture._globalBatch;
        this.settings = settings;
        this.shader = shader;
        // start and size calculated outside
        this.start = 0;
        this.size = 0;
        this.data = null;
        if (shader && (shader as any).settings)
        {
            this.settings = (shader as any).settings;
        }
    }

    check(shader: Shader): boolean
    {
        if (this.size === 0)
        {
            this.shader = shader;

            return true;
        }

        return (this.shader === shader);
    }

    add(texture: Texture, matrix: Matrix, lineWidth: number,
        lineAlignment: number, lineScaleMode: number): number
    {
        const { texArray, TICK, styleArray, settings } = this;
        const { baseTexture } = texture;
        // check tex

        if (baseTexture._batchEnabled !== TICK && texArray.count === settings.maxTextures)
        {
            return -1;
        }
        const loc = baseTexture._batchEnabled !== TICK ? texArray.count : baseTexture._batchLocation;
        // check and add style
        // add1 -> add2 only works in chain, not when there are several adds inside
        const res = styleArray.add(loc, matrix || Matrix.IDENTITY,
            lineWidth, lineAlignment, lineScaleMode, settings);

        if (res >= 0)
        {
            // SUCCESS here
            // add tex
            if (baseTexture._batchEnabled !== TICK)
            {
                baseTexture._batchEnabled = TICK;
                baseTexture._batchLocation = texArray.count;
                texArray.elements[texArray.count++] = baseTexture;
            }
        }

        return res;
    }
}
