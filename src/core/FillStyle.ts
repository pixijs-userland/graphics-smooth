import { Shader, Texture } from '@pixi/core';

import type { Matrix } from '@pixi/core';

/**
 * @memberof PIXI.smooth
 */
export class FillStyle
{
    constructor()
    {
        this.reset();
    }

    color: number;
    alpha: number;
    texture: Texture;
    matrix: Matrix;
    matrixTex: Matrix;
    shader: Shader;
    visible: boolean;
    smooth: boolean;

    toJSON()
    {
        return this.copyTo({});
    }

    clone(): FillStyle
    {
        return this.copyTo(new FillStyle());
    }

    copyTo(obj: any): any
    {
        obj.color = this.color;
        obj.alpha = this.alpha;
        obj.texture = this.texture;
        obj.matrix = this.matrix;
        obj.shader = this.shader;
        obj.visible = this.visible;
        obj.smooth = this.smooth;
        obj.matrixTex = null;

        return obj;
    }

    packLineScale()
    {
        return 0;
    }

    reset()
    {
        this.color = 0xFFFFFF;

        this.alpha = 1;

        this.texture = Texture.WHITE;

        this.matrix = null;

        this.shader = null;

        this.visible = false;

        this.smooth = false;

        this.matrixTex = null;
    }

    destroy()
    {
        this.texture = null;
        this.matrix = null;
        this.matrixTex = null;
    }

    getTextureMatrix()
    {
        const tex = this.texture;

        if (!this.matrix)
        {
            return null;
        }

        if (tex.frame.width === tex.baseTexture.width
            && tex.frame.height === tex.baseTexture.height)
        {
            return this.matrix;
        }

        if (!this.matrixTex)
        {
            this.matrixTex = this.matrix.clone();
        }
        else
        {
            this.matrixTex.copyFrom(this.matrix);
        }
        this.matrixTex.translate(Number(tex.frame.x), Number(tex.frame.y));

        return this.matrixTex;
    }
}
