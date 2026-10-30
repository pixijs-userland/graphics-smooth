import { ExtensionType } from 'pixi.js';
import { AbstractGraphicsGpuData, AbstractGraphicsPipe } from '../base/AbstractGraphicsPipe';
import { BatchableSmoothGraphics } from './BatchableSmoothGraphics';

import type { Renderer } from 'pixi.js';
import type { AbstractGraphicsContextSystem } from '../base/AbstractGraphicsContextSystem';
import type { GraphicsAdaptor } from '../base/GraphicsAdaptorTypes';
import type { GpuSmoothGraphicsContext } from './GpuSmoothGraphicsContext';
import type { SmoothGraphics } from './SmoothGraphics';
import type { SmoothGraphicsContextSystem } from './SmoothGraphicsContextSystem';

/** @internal */
export type SmoothGraphicsGpuData = AbstractGraphicsGpuData<BatchableSmoothGraphics>;

/**
 * Render pipe for smooth HHAA graphics.
 * Handles both batchable (small geometry) and non-batchable (large geometry) paths.
 * @category rendering
 * @internal
 */
export class SmoothGraphicsPipe
    extends AbstractGraphicsPipe<SmoothGraphics, BatchableSmoothGraphics, GpuSmoothGraphicsContext>
{
    /** @ignore */
    public static extension = {
        type: [
            ExtensionType.WebGLPipes,
            ExtensionType.WebGPUPipes,
        ],
        name: 'smoothGraphics',
    } as const;

    protected readonly _batchableClass = BatchableSmoothGraphics;

    constructor(renderer: Renderer, adaptor: GraphicsAdaptor)
    {
        super(renderer, adaptor, 'smoothGraphics');
    }

    protected _getContextSystem(): AbstractGraphicsContextSystem<GpuSmoothGraphicsContext, any>
    {
        return this.renderer.smoothGraphicsContext as SmoothGraphicsContextSystem;
    }

    protected _createGpuData(): AbstractGraphicsGpuData<BatchableSmoothGraphics>
    {
        return new AbstractGraphicsGpuData();
    }
}
