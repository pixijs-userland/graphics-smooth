import { executeGlBatches } from './executeGlBatches';

import type { Graphics, Renderer, Shader, WebGLRenderer } from 'pixi.js';
import type { GraphicsAdaptor, GraphicsPipeLike } from './GraphicsAdaptorTypes';

/**
 * Base class for WebGL graphics adaptors.
 * Subclasses only need to implement `contextChange` for shader creation.
 * @category rendering
 * @internal
 */
export abstract class AbstractGlGraphicsAdaptor implements GraphicsAdaptor
{
    public shader: Shader;

    private readonly _contextSystemKey: string;

    constructor(contextSystemKey: string)
    {
        this._contextSystemKey = contextSystemKey;
    }

    public abstract contextChange(renderer: Renderer): void;

    public execute(graphicsPipe: GraphicsPipeLike, renderable: Graphics): void
    {
        const context = renderable.context;
        const renderer = graphicsPipe.renderer as WebGLRenderer;
        const contextSystem = (renderer as any)[this._contextSystemKey];
        const renderData = contextSystem.getContextRenderData(context);
        const { batcher, instructions } = renderData;
        const shader = context.customShader || this._getShader(renderData);

        executeGlBatches(renderer, shader, batcher, instructions, graphicsPipe.state);
    }

    /**
     * Returns the shader used to render the given render data, when the context has no custom shader.
     * @param _renderData - The render data of the context
     */
    protected _getShader(_renderData: unknown): Shader
    {
        return this.shader;
    }

    public destroy(): void
    {
        this.shader.destroy(true);
        this.shader = null;
    }
}
