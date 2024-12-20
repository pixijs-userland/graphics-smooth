import { BuildData } from './BuildData';
import { SmoothGraphicsData } from './SmoothGraphicsData';

/**
 * @memberof PIXI.smooth
 */
export interface IShapeBuilder
{
    path(graphicsData: SmoothGraphicsData, target: BuildData): void;

    line(graphicsData: SmoothGraphicsData, target: BuildData): void;

    fill(graphicsData: SmoothGraphicsData, target: BuildData): void;
}
