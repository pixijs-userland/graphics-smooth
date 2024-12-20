// for type only
import { SHAPES } from '@pixi/core';
import { BuildData } from '../core/BuildData';
import { JOINT_TYPE } from '../core/const';
import { SmoothGraphicsData } from '../core/SmoothGraphicsData';

import type { Circle, Ellipse, RoundedRectangle } from '@pixi/core';
import type { IShapeBuilder } from '../core/IShapeBuilder';

/**
 * @memberof PIXI.smooth
 */
export class CircleBuilder implements IShapeBuilder
{
    path(graphicsData: SmoothGraphicsData, _target: BuildData)
    {
        // need to convert points to a nice regular data
        const points = graphicsData.points;

        let x;
        let y;
        let dx;
        let dy;
        let rx;
        let ry;

        if (graphicsData.type === SHAPES.CIRC)
        {
            const circle = graphicsData.shape as Circle;

            x = circle.x;
            y = circle.y;
            rx = ry = circle.radius;
            dx = dy = 0;
        }
        else if (graphicsData.type === SHAPES.ELIP)
        {
            const ellipse = graphicsData.shape as Ellipse;

            x = ellipse.x;
            y = ellipse.y;
            rx = ellipse.width;
            ry = ellipse.height;
            dx = dy = 0;
        }
        else
        {
            const roundedRect = graphicsData.shape as RoundedRectangle;
            const halfWidth = roundedRect.width / 2;
            const halfHeight = roundedRect.height / 2;

            x = roundedRect.x + halfWidth;
            y = roundedRect.y + halfHeight;
            rx = ry = Math.max(0, Math.min(roundedRect.radius, Math.min(halfWidth, halfHeight)));
            dx = halfWidth - rx;
            dy = halfHeight - ry;
        }

        if (!(rx >= 0 && ry >= 0 && dx >= 0 && dy >= 0))
        {
            points.length = 0;

            return;
        }

        // Choose a number of segments such that the maximum absolute deviation from the circle is approximately 0.029
        const n = Math.ceil(2.3 * Math.sqrt(rx + ry));
        const m = (n * 8) + (dx ? 4 : 0) + (dy ? 4 : 0);

        points.length = m;

        if (m === 0)
        {
            return;
        }

        if (n === 0)
        {
            points.length = 8;
            points[0] = points[6] = x + dx;
            points[1] = points[3] = y + dy;
            points[2] = points[4] = x - dx;
            points[5] = points[7] = y - dy;

            return;
        }

        let j1 = 0;
        let j2 = (n * 4) + (dx ? 2 : 0) + 2;
        let j3 = j2;
        let j4 = m;

        {
            const x0 = dx + rx;
            const y0 = dy;
            const x1 = x + x0;
            const x2 = x - x0;
            const y1 = y + y0;

            points[j1++] = x1;
            points[j1++] = y1;
            points[--j2] = y1;
            points[--j2] = x2;

            if (dy)
            {
                const y2 = y - y0;

                points[j3++] = x2;
                points[j3++] = y2;
                points[--j4] = y2;
                points[--j4] = x1;
            }
        }

        for (let i = 1; i < n; i++)
        {
            const a = Math.PI / 2 * (i / n);
            const x0 = dx + (Math.cos(a) * rx);
            const y0 = dy + (Math.sin(a) * ry);
            const x1 = x + x0;
            const x2 = x - x0;
            const y1 = y + y0;
            const y2 = y - y0;

            points[j1++] = x1;
            points[j1++] = y1;
            points[--j2] = y1;
            points[--j2] = x2;
            points[j3++] = x2;
            points[j3++] = y2;
            points[--j4] = y2;
            points[--j4] = x1;
        }

        {
            const x0 = dx;
            const y0 = dy + ry;
            const x1 = x + x0;
            const x2 = x - x0;
            const y1 = y + y0;
            const y2 = y - y0;

            points[j1++] = x1;
            points[j1++] = y1;
            points[--j4] = y2;
            points[--j4] = x1;

            if (dx)
            {
                points[j1++] = x2;
                points[j1++] = y1;
                points[--j4] = y2;
                points[--j4] = x2;
            }
        }
    }

    fill(graphicsData: SmoothGraphicsData, target: BuildData)
    {
        const { verts, joints } = target;
        const { points, triangles } = graphicsData;

        if (points.length === 0)
        {
            return;
        }

        let x;
        let y;

        if (graphicsData.type !== SHAPES.RREC)
        {
            const circle = graphicsData.shape as Circle;

            x = circle.x;
            y = circle.y;
        }
        else
        {
            const roundedRect = graphicsData.shape as RoundedRectangle;

            x = roundedRect.x + (roundedRect.width / 2);
            y = roundedRect.y + (roundedRect.height / 2);
        }

        const matrix = graphicsData.matrix;
        const cx = matrix ? (matrix.a * x) + (matrix.c * y) + matrix.tx : x;
        const cy = matrix ? (matrix.b * x) + (matrix.d * y) + matrix.ty : y;

        let vertPos = 1;
        const center = 0;

        if (!graphicsData.fillAA)
        {
            verts.push(cx, cy);
            joints.push(JOINT_TYPE.FILL);
            verts.push(points[0], points[1]);
            joints.push(JOINT_TYPE.FILL);

            for (let i = 2; i < points.length; i += 2)
            {
                verts.push(points[i], points[i + 1]);
                joints.push(JOINT_TYPE.FILL);

                triangles.push(vertPos++, center, vertPos);
            }

            triangles.push(center + 1, center, vertPos);

            return;
        }

        const len = points.length;

        let x1 = points[len - 2];
        let y1 = points[len - 1];

        let nx1 = y1 - points[len - 3];
        let ny1 = points[len - 4] - x1;
        const n1 = Math.sqrt((nx1 * nx1) + (ny1 * ny1));

        nx1 /= n1;
        ny1 /= n1;

        let bx1;
        let by1;

        for (let i = 0; i < len; i += 2)
        {
            const x2 = points[i];
            const y2 = points[i + 1];

            let nx2 = y2 - y1;
            let ny2 = x1 - x2;
            const n2 = Math.sqrt((nx2 * nx2) + (ny2 * ny2));

            nx2 /= n2;
            ny2 /= n2;

            let bx2 = nx1 + nx2;
            let by2 = ny1 + ny2;
            const b2 = (nx2 * bx2) + (ny2 * by2);

            bx2 /= b2;
            by2 /= b2;

            if (i > 0)
            {
                verts.push(bx2);
                verts.push(by2);
            }
            else
            {
                bx1 = bx2;
                by1 = by2;
            }

            verts.push(cx);
            verts.push(cy);
            verts.push(x1);
            verts.push(y1);
            verts.push(x2);
            verts.push(y2);

            verts.push(0);
            verts.push(0);
            verts.push(bx2);
            verts.push(by2);

            joints.push(JOINT_TYPE.FILL_EXPAND + 2);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);

            x1 = x2;
            y1 = y2;
            nx1 = nx2;
            ny1 = ny2;
        }

        verts.push(bx1);
        verts.push(by1);
    }

    line(graphicsData: SmoothGraphicsData, target: BuildData): void
    {
        const { verts, joints } = target;
        const { points } = graphicsData;
        const joint = points.length === 8 // we dont need joints for arcs
            ? graphicsData.goodJointType() : JOINT_TYPE.JOINT_MITER + 3;
        const len = points.length;

        if (len === 0)
        {
            return;
        }

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
}
