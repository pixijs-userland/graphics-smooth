import { FillStyle } from './FillStyle';
import { LineStyle } from './LineStyle';

/**
 * @memberof PIXI.smooth
 */
export class BatchPart
{
    public style: LineStyle | FillStyle;
    public start: number;
    public size: number;
    public jointEnd: number;
    public attribStart: number;
    public attribSize: number;
    public styleId: number;
    public rgba: number;

    constructor()
    {
        this.reset();
    }

    public begin(style: LineStyle | FillStyle, startIndex: number, attribStart: number): void
    {
        this.reset();
        this.style = style;
        this.start = startIndex;
        this.attribStart = attribStart;
        this.jointEnd = 0;
    }

    public end(endIndex: number, endAttrib: number): void
    {
        this.attribSize = endAttrib - this.attribStart;
        this.size = endIndex - this.start;
    }

    public reset(): void
    {
        this.style = null;
        this.size = 0;
        this.start = 0;
        this.attribStart = 0;
        this.attribSize = 0;
        this.styleId = -1;
        this.rgba = 0;
        this.jointEnd = 0;
    }
}
