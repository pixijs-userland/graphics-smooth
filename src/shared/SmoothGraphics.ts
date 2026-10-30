import { Graphics, GraphicsContext } from 'pixi.js';
import '../init';

import type { GraphicsOptions } from 'pixi.js';

/**
 * A display object that renders vector graphics using shader-based HHAA
 * (Half-plane, Half-axis Anti-Aliasing) for smooth, resolution-independent edges.
 *
 * Uses the same GraphicsContext API as standard Graphics but routes rendering
 * through the SmoothBatcher with a custom HHAA shader.
 *
 * On the canvas renderer, it is rendered like a regular Graphics.
 * @category scene
 * @advanced
 */
export class SmoothGraphics extends Graphics
{
    /** @internal */
    public override readonly renderPipeId: string = 'smoothGraphics';

    /**
     * Creates a new SmoothGraphics object.
     * @param options - Options for the SmoothGraphics.
     */
    constructor(options?: GraphicsOptions | GraphicsContext)
    {
        if (options instanceof GraphicsContext)
        {
            options = { context: options };
        }

        super({ label: 'SmoothGraphics', ...options });
    }

    /**
     * Creates a clone of this SmoothGraphics.
     * @param deep - If true, clones the context; if false, shares it
     * @returns A new SmoothGraphics instance
     */
    public override clone(deep = false): SmoothGraphics
    {
        if (deep)
        {
            return new SmoothGraphics(this.context.clone());
        }

        // `_ownedContext` is private in the published typings; mirror Graphics.clone()
        (this as unknown as { _ownedContext: GraphicsContext })._ownedContext = null;

        return new SmoothGraphics(this.context);
    }
}
