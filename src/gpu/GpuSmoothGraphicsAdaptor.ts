import { ExtensionType, Matrix, Shader, UniformGroup } from 'pixi.js';
import { AbstractGpuGraphicsAdaptor } from '../base/AbstractGpuGraphicsAdaptor';
import { SmoothShader } from '../shared/batcher/SmoothShader';

import type { Renderer } from 'pixi.js';
import type { SmoothGraphicsContextRenderData } from '../shared/SmoothGraphicsContextSystem';

/**
 * WebGPU adaptor for non-batchable smooth graphics rendering.
 * @category rendering
 * @internal
 */
export class GpuSmoothGraphicsAdaptor extends AbstractGpuGraphicsAdaptor
{
    /** @ignore */
    public static extension = {
        type: [
            ExtensionType.WebGPUPipesAdaptor,
        ],
        name: 'smoothGraphics',
    } as const;

    private _texturedShader: Shader;

    constructor()
    {
        super('smoothGraphicsContext');
    }

    public contextChange(renderer: Renderer): void
    {
        const localUniforms = new UniformGroup({
            uTransformMatrix: { value: new Matrix(), type: 'mat3x3<f32>' },
            uColor: { value: new Float32Array([1, 1, 1, 1]), type: 'vec4<f32>' },
            uRound: { value: 0, type: 'f32' },
        });

        this._maxTextures = renderer.limits.maxBatchableTextures;

        // Both shaders share the uniform group, so that the pipe only has to update this.shader
        this.shader = new Shader({
            gpuProgram: new SmoothShader(this._maxTextures, true).gpuProgram,
            resources: { localUniforms },
        });
        this._texturedShader = new Shader({
            gpuProgram: new SmoothShader(this._maxTextures, true, true).gpuProgram,
            resources: { localUniforms },
        });
    }

    protected override _getShader(renderData: SmoothGraphicsContextRenderData): Shader
    {
        return renderData.textured ? this._texturedShader : this.shader;
    }

    public override destroy(): void
    {
        this._texturedShader.destroy(true);
        this._texturedShader = null;
        super.destroy();
    }
}
