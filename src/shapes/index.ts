import { SHAPES } from '@pixi/core';
import { IShapeBuilder } from '../core/IShapeBuilder';
import { CircleBuilder } from './CircleBuilder';
import { PolyBuilder } from './PolyBuilder';
import { RectangleBuilder } from './RectangleBuilder';
import { RoundedRectangleBuilder } from './RoundedRectangleBuilder';

export const FILL_COMMANDS: Record<SHAPES, IShapeBuilder> = {
    [SHAPES.POLY]: new PolyBuilder(),
    [SHAPES.CIRC]: new CircleBuilder(),
    [SHAPES.ELIP]: new CircleBuilder(),
    [SHAPES.RECT]: new RectangleBuilder(),
    [SHAPES.RREC]: new RoundedRectangleBuilder()
};

export { CircleBuilder, PolyBuilder, RectangleBuilder, RoundedRectangleBuilder };
