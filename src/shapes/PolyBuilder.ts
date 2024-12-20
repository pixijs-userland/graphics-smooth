import { Point, Polygon, utils } from '@pixi/core';
import { BuildData } from '../core/BuildData';
import { JOINT_TYPE } from '../core/const';
import { SmoothGraphicsData } from '../core/SmoothGraphicsData';

import type { IShapeBuilder } from '../core/IShapeBuilder';

const tempArr: Array<number> = [];

function fixOrientation(points: number[], hole = false)
{
    const m = points.length;

    if (m < 6)
    {
        return;
    }

    let area = 0;

    for (let i = 0, x1 = points[m - 2], y1 = points[m - 1]; i < m; i += 2)
    {
        const x2 = points[i];
        const y2 = points[i + 1];

        area += (x2 - x1) * (y2 + y1);

        x1 = x2;
        y1 = y2;
    }

    if ((!hole && area > 0) || (hole && area <= 0))
    {
        const n = m / 2;

        for (let i = n + (n % 2); i < m; i += 2)
        {
            const i1 = m - i - 2;
            const i2 = m - i - 1;
            const i3 = i;
            const i4 = i + 1;

            [points[i1], points[i3]] = [points[i3], points[i1]];
            [points[i2], points[i4]] = [points[i4], points[i2]];
        }
    }
}

/**
 * @memberof PIXI.smooth
 */
export class PolyBuilder implements IShapeBuilder
{
    path(graphicsData: SmoothGraphicsData, buildData: BuildData)
    {
        const shape = graphicsData.shape as Polygon;
        const points = graphicsData.points = shape.points.slice();
        const eps = buildData.closePointEps;
        const eps2 = eps * eps;

        if (points.length === 0)
        {
            return;
        }

        const firstPoint = new Point(points[0], points[1]);
        const lastPoint = new Point(points[points.length - 2], points[points.length - 1]);
        const closedShape = graphicsData.closeStroke = shape.closeStroke;

        let len = points.length;
        let newLen = 2;

        // 1. remove equal points
        for (let i = 2; i < len; i += 2)
        {
            const x1 = points[i - 2];
            const y1 = points[i - 1];
            const x2 = points[i];
            const y2 = points[i + 1];
            let flag = true;

            if (Math.abs(x1 - x2) < eps
                && Math.abs(y1 - y2) < eps)
            {
                flag = false;
            }

            if (flag)
            {
                points[newLen] = points[i];
                points[newLen + 1] = points[i + 1];
                newLen += 2;
            }
        }
        points.length = len = newLen;

        newLen = 2;
        // 2. remove middle points
        for (let i = 2; i + 2 < len; i += 2)
        {
            let x1 = points[i - 2];
            let y1 = points[i - 1];
            const x2 = points[i];
            const y2 = points[i + 1];
            let x3 = points[i + 2];
            let y3 = points[i + 3];

            x1 -= x2;
            y1 -= y2;
            x3 -= x2;
            y3 -= y2;
            let flag = true;

            if (Math.abs((x3 * y1) - (y3 * x1)) < eps2)
            {
                if ((x1 * x3) + (y1 * y3) < -eps2)
                {
                    flag = false;
                }
            }

            if (flag)
            {
                points[newLen] = points[i];
                points[newLen + 1] = points[i + 1];
                newLen += 2;
            }
        }
        points[newLen] = points[len - 2];
        points[newLen + 1] = points[len - 1];
        newLen += 2;

        points.length = len = newLen;

        if (len <= 2)
        {
            // suddenly, nothing
            return;
        }

        if (closedShape)
        {
            // first point should be last point in closed line!
            const closedPath = Math.abs(firstPoint.x - lastPoint.x) < eps
                && Math.abs(firstPoint.y - lastPoint.y) < eps;

            if (closedPath)
            {
                points.pop();
                points.pop();
            }
        }
    }

    line(graphicsData: SmoothGraphicsData, buildData: BuildData)
    {
        const { closeStroke, points } = graphicsData;
        // const eps = buildData.closePointEps;
        // const eps2 = eps * eps;
        const len = points.length;
        // const style = graphicsData.lineStyle;

        if (len <= 2)
        {
            return;
        }
        const { verts, joints } = buildData;

        // TODO: alignment

        const joint = graphicsData.jointType();
        const cap = graphicsData.capType();
        let prevCap = 0;

        let prevX: number; let
            prevY: number;

        if (closeStroke)
        {
            prevX = points[len - 2];
            prevY = points[len - 1];
            joints.push(JOINT_TYPE.NONE);
        }
        else
        {
            prevX = points[2];
            prevY = points[3];
            if (cap === JOINT_TYPE.CAP_ROUND)
            {
                verts.push(points[0], points[1]);
                joints.push(JOINT_TYPE.NONE);
                joints.push(JOINT_TYPE.CAP_ROUND);
                prevCap = 0;
            }
            else
            {
                prevCap = cap;
                joints.push(JOINT_TYPE.NONE);
            }
        }
        verts.push(prevX, prevY);

        /* Line segments of interest where (x1,y1) forms the corner. */
        for (let i = 0; i < len; i += 2)
        {
            const x1 = points[i]; const
                y1 = points[i + 1];

            // let x2: number; let
            //     y2: number;

            // if (i + 2 < len)
            // {
            //     x2 = points[i + 2];
            //     y2 = points[i + 3];
            // }
            // else
            // {
            //     x2 = points[0];
            //     y2 = points[1];
            // }

            // const dx = x2 - x1;
            // const dy = y2 - y1;
            // let nextX: number; let
            //     nextY: number;

            let endJoint = joint;

            if (i + 2 >= len)
            {
                // nextX = points[2];
                // nextY = points[3];
                if (!closeStroke)
                {
                    endJoint = JOINT_TYPE.NONE;
                }
            }
            else if (i + 4 >= len)
            {
                // nextX = points[0];
                // nextY = points[1];
                if (!closeStroke)
                {
                    if (cap === JOINT_TYPE.CAP_ROUND)
                    {
                        endJoint = JOINT_TYPE.JOINT_CAP_ROUND;
                    }
                    if (cap === JOINT_TYPE.CAP_BUTT)
                    {
                        endJoint = JOINT_TYPE.JOINT_CAP_BUTT;
                    }
                    if (cap === JOINT_TYPE.CAP_SQUARE)
                    {
                        endJoint = JOINT_TYPE.JOINT_CAP_SQUARE;
                    }
                }
            }
            // else
            // {
            //     nextX = points[i + 4];
            //     nextY = points[i + 5];
            // }

            // const dx3 = x1 - prevX;
            // const dy3 = y1 - prevY;

            endJoint += prevCap;
            prevCap = 0;

            verts.push(x1, y1);
            joints.push(endJoint);

            prevX = x1;
            prevY = y1;
        }

        if (closeStroke)
        {
            verts.push(points[0], points[1]);
            joints.push(JOINT_TYPE.NONE);
            verts.push(points[2], points[3]);
            joints.push(JOINT_TYPE.NONE);
        }
        else
        {
            verts.push(points[len - 4], points[len - 3]);
            joints.push(JOINT_TYPE.NONE);
        }
    }

    fill(graphicsData: SmoothGraphicsData, buildData: BuildData)
    {
        let points = graphicsData.points;
        // TODO: simplify holes too!
        const holes = graphicsData.holes;
        const eps = buildData.closePointEps;

        const { verts, joints } = buildData;

        if (points.length < 6)
        {
            return;
        }
        const holeArray = [];
        let len = points.length;

        fixOrientation(points, false);

        // Process holes..
        for (let i = 0; i < holes.length; i++)
        {
            const hole = holes[i];

            fixOrientation(hole.points, true);

            holeArray.push(points.length / 2);
            points = points.concat(hole.points);
        }

        // TODO: reduce size later?
        const pn = tempArr;

        if (pn.length < points.length)
        {
            pn.length = points.length;
        }
        let start = 0;

        for (let i = 0; i <= holeArray.length; i++)
        {
            let finish = len / 2;

            if (i > 0)
            {
                if (i < holeArray.length)
                {
                    finish = holeArray[i];
                }
                else
                {
                    finish = (points.length >> 1);
                }
            }
            pn[start * 2] = finish - 1;
            pn[((finish - 1) * 2) + 1] = start;
            for (let j = start; j + 1 < finish; j++)
            {
                pn[(j * 2) + 1] = j + 1;
                pn[(j * 2) + 2] = j;
            }
            start = finish;
        }

        // sort color
        graphicsData.triangles = utils.earcut(points, holeArray, 2);

        if (!graphicsData.triangles)
        {
            return;
        }

        if (!graphicsData.fillAA)
        {
            for (let i = 0; i < points.length; i += 2)
            {
                verts.push(points[i], points[i + 1]);
                joints.push(JOINT_TYPE.FILL);
            }

            return;
        }

        const { triangles } = graphicsData;

        len = points.length;

        for (let i = 0; i < triangles.length; i += 3)
        {
            // TODO: holes prev/next!!!
            let flag = 0;

            for (let j = 0; j < 3; j++)
            {
                const ind1 = triangles[i + j];
                const ind2 = triangles[i + ((j + 1) % 3)];

                if (pn[ind1 * 2] === ind2 || pn[(ind1 * 2) + 1] === ind2)
                {
                    flag |= (1 << j);
                }
            }
            joints.push(JOINT_TYPE.FILL_EXPAND + flag);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
            joints.push(JOINT_TYPE.NONE);
        }

        // bisect, re-using pn
        for (let ind = 0; ind < len / 2; ind++)
        {
            const prev = pn[ind * 2];
            const next = pn[(ind * 2) + 1];
            let nx1 = (points[(next * 2) + 1] - points[(ind * 2) + 1]); let
                ny1 = -(points[next * 2] - points[ind * 2]);
            let nx2 = (points[(ind * 2) + 1] - points[(prev * 2) + 1]); let
                ny2 = -(points[ind * 2] - points[prev * 2]);
            const D1 = Math.sqrt((nx1 * nx1) + (ny1 * ny1));

            nx1 /= D1;
            ny1 /= D1;
            const D2 = Math.sqrt((nx2 * nx2) + (ny2 * ny2));

            nx2 /= D2;
            ny2 /= D2;

            let bx = (nx1 + nx2);
            let by = (ny1 + ny2);
            const D = (bx * nx1) + (by * ny1);

            if (Math.abs(D) < eps)
            {
                bx = nx1;
                by = ny1;
            }
            else
            {
                bx /= D;
                by /= D;
            }
            pn[ind * 2] = bx;
            pn[(ind * 2) + 1] = by;
        }

        for (let i = 0; i < triangles.length; i += 3)
        {
            const prev = triangles[i];
            const ind = triangles[i + 1];
            const next = triangles[i + 2];
            const nx1 = (points[(next * 2) + 1] - points[(ind * 2) + 1]); const
                ny1 = -(points[next * 2] - points[ind * 2]);
            const nx2 = (points[(ind * 2) + 1] - points[(prev * 2) + 1]); const
                ny2 = -(points[ind * 2] - points[prev * 2]);

            let j1 = 1;

            if ((nx1 * ny2) - (nx2 * ny1) > 0.0)
            {
                j1 = 2;
            }

            for (let j = 0; j < 3; j++)
            {
                const ind = triangles[i + ((j * j1) % 3)];

                verts.push(points[ind * 2], points[(ind * 2) + 1]);
            }
            for (let j = 0; j < 3; j++)
            {
                const ind = triangles[i + ((j * j1) % 3)];

                verts.push(pn[ind * 2], pn[(ind * 2) + 1]);
            }
        }
    }
}
