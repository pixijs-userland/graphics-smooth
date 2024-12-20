import { BuildData } from '../core/BuildData';
import { JOINT_TYPE } from '../core/const';
import { SmoothGraphicsData } from '../core/SmoothGraphicsData';
import { PolyBuilder } from './PolyBuilder';

import type { Rectangle } from '@pixi/core';
import type { IShapeBuilder } from '../core/IShapeBuilder';

/**
 * @memberof PIXI.smooth
 */
export class RectangleBuilder implements IShapeBuilder
{
    _polyBuilder = new PolyBuilder();

    path(graphicsData: SmoothGraphicsData, _target: BuildData)
    {
        // --- //
        // need to convert points to a nice regular data
        //
        const rectData = graphicsData.shape as Rectangle;
        const x = rectData.x;
        const y = rectData.y;
        const width = rectData.width;
        const height = rectData.height;
        const points = graphicsData.points;

        points.length = 0;

        points.push(x, y,
            x + width, y,
            x + width, y + height,
            x, y + height);
    }

    line(graphicsData: SmoothGraphicsData, target: BuildData): void
    {
        const { verts, joints } = target;
        const { points } = graphicsData;

        const joint = graphicsData.goodJointType();
        const len = points.length;

        verts.push(points[len - 2], points[len - 1]);
        joints.push(JOINT_TYPE.NONE);
        for (let i = 0; i < len; i += 2)
        {
            verts.push(points[i], points[i + 1]);
            joints.push(joint);
        }
        verts.push(points[0], points[1]);
        joints.push(JOINT_TYPE.NONE);
        verts.push(points[2], points[3]);
        joints.push(JOINT_TYPE.NONE);
    }

    fill(graphicsData: SmoothGraphicsData, target: BuildData): void
    {
        const { verts, joints } = target;
        const { points, triangles } = graphicsData;

        triangles.length = 0;

        if (!graphicsData.fillAA)
        {
            verts.push(points[0], points[1],
                points[2], points[3],
                points[4], points[5],
                points[6], points[7]);

            joints.push(JOINT_TYPE.FILL, JOINT_TYPE.FILL, JOINT_TYPE.FILL, JOINT_TYPE.FILL);
            triangles.push(0, 1, 2, 0, 2, 3);

            return;
        }

        this._polyBuilder.fill(graphicsData, target);
    }
}
