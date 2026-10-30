import { BigPool, ExtensionType } from 'pixi.js';
import { AbstractGraphicsContextRenderData } from '../base/AbstractGraphicsContextRenderData';
import { AbstractGraphicsContextSystem } from '../base/AbstractGraphicsContextSystem';
import { SmoothBatcher, SmoothTexturedBatcher } from './batcher/SmoothBatcher';
import { buildSmoothContextData } from './builders/buildSmoothContextData';
import { GpuSmoothGraphicsContext } from './GpuSmoothGraphicsContext';

import type { GraphicsContext, Renderer } from 'pixi.js';

/**
 * Render data for a non-batchable smooth graphics context.
 * Owns a private SmoothBatcher used to build draw batches from local-space geometry,
 * or a SmoothTexturedBatcher if any element of the context has a texture.
 * @category rendering
 * @internal
 */
export class SmoothGraphicsContextRenderData extends AbstractGraphicsContextRenderData<SmoothBatcher>
{
    /** Whether the batcher uses the textured vertex format */
    public textured = false;

    public override init(options: { maxTextures: number; textured?: boolean }): void
    {
        const textured = !!options.textured;

        if (this.batcher && this.textured !== textured)
        {
            this.batcher.destroy();
            this.batcher = null;
        }

        this.textured = textured;
        super.init(options);
    }

    protected _createBatcher(maxTextures: number): SmoothBatcher
    {
        return this.textured ? new SmoothTexturedBatcher({ maxTextures }) : new SmoothBatcher({ maxTextures });
    }

    protected _updateBatcher(maxTextures: number): void
    {
        this.batcher._updateMaxTextures(maxTextures);
    }
}

/**
 * System that manages building HHAA geometry from GraphicsContext instructions
 * for smooth graphics rendering.
 * @category rendering
 * @advanced
 */
export class SmoothGraphicsContextSystem
    extends AbstractGraphicsContextSystem<GpuSmoothGraphicsContext, SmoothGraphicsContextRenderData>
{
    /** @ignore */
    public static extension = {
        type: [
            ExtensionType.WebGLSystem,
            ExtensionType.WebGPUSystem,
        ],
        name: 'smoothGraphicsContext'
    } as const;

    constructor(renderer: Renderer)
    {
        super(renderer, 'smoothGraphicsContext');
    }

    protected _createGpuContext(): GpuSmoothGraphicsContext
    {
        return new GpuSmoothGraphicsContext();
    }

    protected _buildContextData(context: GraphicsContext, gpuContext: GpuSmoothGraphicsContext): void
    {
        buildSmoothContextData(context, gpuContext);
    }

    protected _getVertexAndIndexCounts(gpuContext: GpuSmoothGraphicsContext): { vertices: number; indices: number }
    {
        let vertices = 0;
        let indices = 0;

        for (let i = 0; i < gpuContext.batches.length; i++)
        {
            vertices += gpuContext.batches[i].attributeSize;
            indices += gpuContext.batches[i].indexSize;
        }

        return { vertices, indices };
    }

    protected _createRenderData(maxTextures: number, gpuContext: GpuSmoothGraphicsContext): SmoothGraphicsContextRenderData
    {
        const textured = gpuContext.batches.some((batch) => batch.batcherName === 'smoothTextured');

        return BigPool.get(SmoothGraphicsContextRenderData, { maxTextures, textured });
    }
}
