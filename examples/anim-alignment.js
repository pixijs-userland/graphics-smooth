let phase = 0;
const joins = ['miter', 'bevel', 'round'];

function addLine(graphics, y, len, rad, cap)
{
    for (let i = 0; i < 3; i++)
    {
        graphics.moveTo(-5 + i * 250 + 50, 5 + y);
        graphics.lineTo(35 + i * 250 + 50, 45 + y);
        graphics.lineTo(75 + i * 250 + 50, 5 + y);
        graphics.lineTo(115 + i * 250 + 50, 45 + y);
        graphics.lineTo(155 + i * 250 + 50, 5 + y);
        graphics.stroke({
            width: 30,
            color: 0,
            alpha: 1,
            join: joins[i],
            cap,
            // v8 alignment is 1 - v7 alignment
            alignment: (1 - Math.sin(phase)) * 0.5
        });

        // graphics.moveTo(150 - len, y);
        // graphics.lineTo(150, y);
        // graphics.lineTo(150 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    }
}

function addLine2(graphics, y, len, rad, cap)
{
    for (let i = 0; i < 3; i++)
    {
        graphics.moveTo(0 + i * 250 + 50, 110 + y);
        graphics.lineTo(55 + i * 250 + 50, 110 + y);
        graphics.lineTo(55 + i * 250 + 50, 55 + y);
        graphics.lineTo(110 + i * 250 + 50, 55 + y);
        graphics.lineTo(110 + i * 250 + 50, 0 + y);
        graphics.stroke({
            width: 30,
            color: 0,
            alpha: 1,
            join: joins[i],
            cap,
            // v8 alignment is 1 - v7 alignment
            alignment: (1 - Math.sin(phase)) * 0.5
        });

        // graphics.moveTo(150 - len, y);
        // graphics.lineTo(150, y);
        // graphics.lineTo(150 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    }
}

function makeFigures(graphics)
{
    graphics.clear();

    addLine(graphics, 50, 50, 60, 'round');
    addLine2(graphics, 150, 50, 60, 'round');
}

(async () =>
{
    const app = new PIXI.Application();
    await app.init({
        antialias: false,
        width: 800,
        height: 300,
        autoDensity: true,
        resolution: 0.5,
        background: 0xffffff
    });
    const renderer2 = await PIXI.autoDetectRenderer({
        preference: 'canvas',
        width: 800,
        height: 300,
        background: 0xffffff,
        autoDensity: true,
        resolution: 0.5,
    });

    document.body.appendChild(app.canvas);
    document.body.appendChild(renderer2.canvas);
    app.canvas.style['image-rendering'] = 'pixelated'
    app.canvas.style.display = 'block';
    renderer2.canvas.style['image-rendering'] = 'pixelated'
    renderer2.canvas.style.display = 'block';

    const graphics = new PIXI.smooth.SmoothGraphics();

    app.stage.addChild(graphics);

    // rendered by the canvas renderer only
    const graphics2 = new PIXI.Graphics();
    // graphics2.y = 300;

    // graphics.rotation = Math.PI * 3 / 2 - 0.0001;
    app.ticker.add((ticker) =>
    {
        phase -= 0.008 * ticker.deltaTime;
        makeFigures(graphics);
        makeFigures(graphics2);
        renderer2.render(graphics2);
    });
})();
