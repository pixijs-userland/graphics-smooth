const app = new PIXI.Application({
    antialias: false,
    width: 800,
    height: 300,
    autoDensity: true,
    resolution: 0.5,
    backgroundColor: 0xffffff
});
const renderer2 = new PIXI.CanvasRenderer({
    width: 800,
    height: 300,
    backgroundColor: 0xffffff,
    autoDensity: true,
    resolution: 0.5,
});

document.body.appendChild(app.view);
document.body.appendChild(renderer2.view);
app.view.style['image-rendering'] = 'pixelated'
app.view.style.display = 'block';
renderer2.view.style['image-rendering'] = 'pixelated'
renderer2.view.style.display = 'block';


try
{
    module.hot.dispose(() =>
    {
        app.destroy();
    });
}
catch (e) {}

const graphics = new PIXI.smooth.SmoothGraphics();

app.stage.addChild(graphics);

const graphics2 = new PIXI.Graphics();
// graphics2.y = 300;

app.stage.addChild(graphics2);

let phase = 0;
const joins = [PIXI.LINE_JOIN.MITER, PIXI.LINE_JOIN.BEVEL, PIXI.LINE_JOIN.ROUND];

function addLine(graphics, y, len, rad, cap)
{
    graphics.lineStyle({
        width: 30,
        color: 0,
        alpha: 1,
        join: PIXI.LINE_JOIN.MITER,
        cap
    });
    for (let i = 0; i < 3; i++)
    {
        graphics.lineStyle({
            width: 30,
            color: 0,
            alpha: 1,
            join: joins[i],
            cap,
            alignment: (Math.sin(phase) + 1) * 0.5
        });
        graphics.moveTo(-5 + i * 250 + 50, 5 + y);
        graphics.lineTo(35 + i * 250 + 50, 45 + y);
        graphics.lineTo(75 + i * 250 + 50, 5 + y);
        graphics.lineTo(115 + i * 250 + 50, 45 + y);
        graphics.lineTo(155 + i * 250 + 50, 5 + y);

        // graphics.moveTo(150 - len, y);
        // graphics.lineTo(150, y);
        // graphics.lineTo(150 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    }
}

function addLine2(graphics, y, len, rad, cap)
{
    graphics.lineStyle({
        width: 30,
        color: 0,
        alpha: 1,
        join: PIXI.LINE_JOIN.MITER,
        cap
    });
    for (let i = 0; i < 3; i++)
    {
        graphics.lineStyle({
            width: 30,
            color: 0,
            alpha: 1,
            join: joins[i],
            cap,
            alignment: (Math.sin(phase) + 1) * 0.5
        });
        graphics.moveTo(0 + i * 250 + 50, 110 + y);
        graphics.lineTo(55 + i * 250 + 50, 110 + y);
        graphics.lineTo(55 + i * 250 + 50, 55 + y);
        graphics.lineTo(110 + i * 250 + 50, 55 + y);
        graphics.lineTo(110 + i * 250 + 50, 0 + y);

        // graphics.moveTo(150 - len, y);
        // graphics.lineTo(150, y);
        // graphics.lineTo(150 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    }
}

function makeFigures(graphics)
{
    graphics.clear();

    addLine(graphics, 50, 50, 60, PIXI.LINE_CAP.ROUND);
    addLine2(graphics, 150, 50, 60, PIXI.LINE_CAP.ROUND);
}

// graphics.rotation = Math.PI * 3 / 2 - 0.0001;
app.ticker.add((delta) =>
{
    phase -= 0.008 * delta;
    makeFigures(graphics);
    makeFigures(graphics2);
    renderer2.render(graphics2);
});
