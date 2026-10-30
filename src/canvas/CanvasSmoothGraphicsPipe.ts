import { ExtensionType } from 'pixi.js';

import type { Graphics, InstructionSet, Renderer, RenderPipe } from 'pixi.js';

/** @internal */
export class CanvasSmoothGraphicsPipe implements RenderPipe<Graphics>
{
    /** @ignore */
    public static extension = {
        type: [
            ExtensionType.CanvasPipes,
        ],
        name: 'smoothGraphics',
    } as const;

    public renderer: Renderer;

    constructor(renderer: Renderer)
    {
        this.renderer = renderer;
    }

    public validateRenderable(_graphics: Graphics): boolean
    {
        return false;
    }

    public addRenderable(graphics: Graphics, instructionSet: InstructionSet)
    {
        this.renderer.renderPipes.graphics.addRenderable(graphics, instructionSet);
    }

    public updateRenderable(_graphics: Graphics)
    {
        // no-op for canvas
    }

    public execute(graphics: Graphics)
    {
        this.renderer.renderPipes.graphics.execute(graphics);
    }

    public destroy()
    {
        this.renderer = null;
    }
}
