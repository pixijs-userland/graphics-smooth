import { getBatchSamplersUniformGroup, GlProgram, GpuProgram, Shader } from 'pixi.js';
import {
    buildGlVertexSrc,
    glFragmentPreamble,
    glHhaaAlphaBlock,
    glPixelLineFunction,
    glTextureSampleAndOutput,
    wgslFragmentOpen,
    wgslHelperFunctions,
    wgslHhaaAlphaBlock,
    wgslLocalUniformsBlock,
    wgslPixelLineFunction,
    wgslStructsAndConstants,
    wgslTextureBindingsAndBranches,
    wgslTextureSampleAndReturn,
    wgslVertexBody,
} from '../shaderSnippets';

export { buildGlVertexSrc, generateGlSampleSrc } from '../shaderSnippets';

function buildGlFragmentSrc(maxTextures: number): string
{
    return `${glFragmentPreamble(maxTextures)
        + glPixelLineFunction()
    }\nvoid main(void){\n    float alpha = 1.0;\n${
        glHhaaAlphaBlock()
    }${glTextureSampleAndOutput(maxTextures)}`;
}

function buildWgslSource(maxTextures: number, includeLocalUniforms: boolean, textured: boolean): string
{
    const { bindings, branches } = wgslTextureBindingsAndBranches(maxTextures);

    const worldMatrixExpr = includeLocalUniforms
        ? 'globalUniforms.uWorldTransformMatrix * localUniforms.uTransformMatrix'
        : 'globalUniforms.uWorldTransformMatrix';

    const colorUniformExpr = includeLocalUniforms
        ? 'localUniforms.uColor * globalUniforms.uWorldColorAlpha'
        : 'globalUniforms.uWorldColorAlpha';

    return `\n${
        wgslStructsAndConstants(textured)
    }${includeLocalUniforms ? wgslLocalUniformsBlock() : ''
    }${bindings}\n${
        wgslHelperFunctions()
    }${wgslVertexBody(worldMatrixExpr, colorUniformExpr, textured)
    }${wgslPixelLineFunction()
    }${wgslFragmentOpen()
    }${wgslHhaaAlphaBlock()
    }${wgslTextureSampleAndReturn(branches)}`;
}

/**
 * Shader for smooth HHAA graphics rendering.
 * Includes both GLSL (WebGL) and WGSL (WebGPU) programs.
 * @category rendering
 * @advanced
 */
export class SmoothShader extends Shader
{
    /** @internal */
    public maxTextures?: number;
    /** Whether the shader computes texture coordinates (for the 'smoothTextured' vertex format) */
    public readonly textured: boolean;

    /**
     * @param maxTextures - max batch textures
     * @param includeLocalUniforms - whether the shader uses local uniforms (non-batched rendering)
     * @param textured - whether the vertices carry a texture coordinate matrix
     */
    constructor(maxTextures: number, includeLocalUniforms = false, textured = false)
    {
        const name = `smooth-${includeLocalUniforms ? 'local' : 'batch'}${textured ? '-textured' : ''}`;
        const glProgram = GlProgram.from({
            vertex: buildGlVertexSrc(includeLocalUniforms, textured),
            fragment: buildGlFragmentSrc(maxTextures),
            name,
        });

        const wgslSrc = buildWgslSource(maxTextures, includeLocalUniforms, textured);

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslSrc,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source: wgslSrc,
                entryPoint: 'mainFragment',
            },
            name,
        });

        super({
            glProgram,
            gpuProgram,
            resources: {
                batchSamplers: getBatchSamplersUniformGroup(maxTextures),
            },
        });

        this.maxTextures = maxTextures;
        this.textured = textured;
    }
}
