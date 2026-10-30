import type { Graphics, Renderer, Shader, State } from 'pixi.js';

/**
 * Minimal pipe surface exposed to adaptor execute methods.
 * @internal
 */
export interface GraphicsPipeLike
{
    renderer: Renderer;
    state: State;
}

/**
 * Shared interface for GL/GPU graphics adaptors.
 * Works for both Graphics and SmoothGraphics (which extends Graphics).
 * @internal
 */
export interface GraphicsAdaptor
{
    shader: Shader;
    contextChange(renderer: Renderer): void;
    execute(graphicsPipe: GraphicsPipeLike, renderable: Graphics): void;
    destroy(): void;
}
