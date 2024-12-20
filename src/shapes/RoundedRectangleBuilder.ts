import { CircleBuilder } from './CircleBuilder';

import type { BuildData } from '../core/BuildData';
import type { IShapeBuilder } from '../core/IShapeBuilder';
import type { SmoothGraphicsData } from '../core/SmoothGraphicsData';

/**
 * @memberof PIXI.smooth
 */
export class RoundedRectangleBuilder implements IShapeBuilder
{
    _circleBuilder = new CircleBuilder();

    path(graphicsData: SmoothGraphicsData, target: BuildData)
    {
        this._circleBuilder.path(graphicsData, target);
    }

    line(graphicsData: SmoothGraphicsData, target: BuildData): void
    {
        this._circleBuilder.line(graphicsData, target);
    }

    fill(graphicsData: SmoothGraphicsData, target: BuildData): void
    {
        this._circleBuilder.fill(graphicsData, target);
    }
}
