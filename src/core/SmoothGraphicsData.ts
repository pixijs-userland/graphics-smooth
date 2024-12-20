import { LINE_CAP, LINE_JOIN } from '@pixi/graphics';
import { JOINT_TYPE } from './const';
import { FillStyle } from './FillStyle';
import { LineStyle } from './LineStyle';

import type { IShape, Matrix, SHAPES } from '@pixi/core';

/**
 * A class to contain data useful for Graphics objects
 *
 * @memberof PIXI.smooth
 */
export class SmoothGraphicsData
{
    shape: IShape;
    lineStyle: LineStyle;
    fillStyle: FillStyle;
    matrix: Matrix;
    type: SHAPES;
    holes: Array<SmoothGraphicsData>;

    // result of simplification
    closeStroke: boolean;
    points: number[];
    triangles: number[];
    // indices in build
    attribStart: number;
    fillStart: number;
    fillLen: number;
    strokeStart: number;
    strokeLen: number;
    fillAA: boolean;

    constructor(shape: IShape, fillStyle: FillStyle = null, lineStyle: LineStyle = null, matrix: Matrix = null)
    {
        this.shape = shape;

        this.lineStyle = lineStyle;

        this.fillStyle = fillStyle;

        this.matrix = matrix;

        this.type = shape.type;

        this.points = [];

        this.holes = [];

        this.triangles = [];

        this.closeStroke = false;

        this.clearBuild();
    }

    public clearPath()
    {
        this.points.length = 0;
        this.closeStroke = true;
    }

    public clearBuild()
    {
        this.triangles.length = 0;
        this.fillStart = 0;
        this.fillLen = 0;
        this.strokeStart = 0;
        this.strokeLen = 0;
        this.fillAA = false;
    }

    public clone(): SmoothGraphicsData
    {
        return new SmoothGraphicsData(
            this.shape,
            this.fillStyle,
            this.lineStyle,
            this.matrix
        );
    }

    public capType()
    {
        let cap: number;

        switch (this.lineStyle.cap)
        {
            case LINE_CAP.SQUARE:
                cap = JOINT_TYPE.CAP_SQUARE;
                break;
            case LINE_CAP.ROUND:
                cap = JOINT_TYPE.CAP_ROUND;
                break;
            default:
                cap = JOINT_TYPE.CAP_BUTT;
                break;
        }

        return cap;
    }

    public goodJointType()
    {
        let joint: number;

        switch (this.lineStyle.join)
        {
            case LINE_JOIN.BEVEL:
                joint = JOINT_TYPE.JOINT_BEVEL;
                break;
            case LINE_JOIN.ROUND:
                joint = JOINT_TYPE.JOINT_ROUND;
                break;
            default:
                joint = JOINT_TYPE.JOINT_MITER + 3;
                break;
        }

        return joint;
    }

    public jointType()
    {
        let joint: number;

        switch (this.lineStyle.join)
        {
            case LINE_JOIN.BEVEL:
                joint = JOINT_TYPE.JOINT_BEVEL;
                break;
            case LINE_JOIN.ROUND:
                joint = JOINT_TYPE.JOINT_ROUND;
                break;
            default:
                joint = JOINT_TYPE.JOINT_MITER;
                break;
        }

        return joint;
    }

    public destroy(): void
    {
        this.shape = null;
        this.holes.length = 0;
        this.holes = null;
        this.points.length = 0;
        this.points = null;
        this.lineStyle = null;
        this.fillStyle = null;
        this.triangles = null;
    }
}
