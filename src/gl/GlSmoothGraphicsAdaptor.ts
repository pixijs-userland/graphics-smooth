import { ExtensionType, getBatchSamplersUniformGroup, Matrix, Shader, UniformGroup } from 'pixi.js';
import { AbstractGlGraphicsAdaptor } from '../base/AbstractGlGraphicsAdaptor';
import { SmoothShader } from '../shared/batcher/SmoothShader';

import type { Renderer } from 'pixi.js';
import type { SmoothGraphicsContextRenderData } from '../shared/SmoothGraphicsContextSystem';

/**
 * WebGL adaptor for non-batchable smooth graphics rendering.
 * Creates a shader with local uniforms (uTransformMatrix, uColor, uRound)
 * and delegates to the SmoothShader's GLSL programs.
 * @category rendering
 * @internal
 */
export class GlSmoothGraphicsAdaptor extends AbstractGlGraphicsAdaptor
{
    /** @ignore */
    public static extension = {
        type: [
            ExtensionType.WebGLPipesAdaptor,
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
        const uniforms = new UniformGroup({
            uColor: { value: new Float32Array([1, 1, 1, 1]), type: 'vec4<f32>' },
            uTransformMatrix: { value: new Matrix(), type: 'mat3x3<f32>' },
            uRound: { value: 0, type: 'f32' },
        });

        const maxTextures = renderer.limits.maxBatchableTextures;
        const batchSamplers = getBatchSamplersUniformGroup(maxTextures);

        // Both shaders share the uniform group, so that the pipe only has to update this.shader
        this.shader = new Shader({
            glProgram: new SmoothShader(maxTextures, true).glProgram,
            resources: { localUniforms: uniforms, batchSamplers },
        });
        this._texturedShader = new Shader({
            glProgram: new SmoothShader(maxTextures, true, true).glProgram,
            resources: { localUniforms: uniforms, batchSamplers },
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
