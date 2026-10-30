function addLine(graphics, y)
{
    graphics.clear();
    graphics.moveTo(2, y + 2);
    graphics.lineTo(14, y + 14);
    graphics.stroke({
        width: 3,
        color: 0,
        alpha: 1,
    });

    graphics.moveTo(16 + 6, y + 8);
    graphics.lineTo(16 + 10, y + 8);
    graphics.stroke({
        width: 8,
        color: 0,
        alpha: 1,
        cap: 'round'
    });

    graphics.moveTo(32 + 4, y + 2);
    graphics.lineTo(32 + 4, y + 14);
    graphics.stroke({
        width: 2,
        color: 0,
        alpha: 1,
    });
}

(async () =>
{
    const app = new PIXI.Application();
    await app.init({
        antialias: false,
        width: 48,
        height: 16,
        resolution: 2,
        background: 0xffffff
    });
    const renderer2 = await PIXI.autoDetectRenderer({
        preference: 'canvas',
        width: 48,
        height: 16,
        background: 0xffffff,
        resolution: 2,
    });

    // PIXI.smooth.settings.PIXEL_LINE = 1 (alternative pixel coverage formula) is not available in v8

    document.body.appendChild(app.canvas);
    document.body.appendChild(renderer2.canvas);
    app.canvas.style['image-rendering'] = 'pixelated'
    app.canvas.style.width = '960px';
    app.canvas.style.height = '320px';
    app.canvas.style.display = 'block';
    renderer2.canvas.style['image-rendering'] = 'pixelated'
    renderer2.canvas.style.width = '960px';
    renderer2.canvas.style.height = '320px';
    renderer2.canvas.style.display = 'block';

    const graphics = new PIXI.smooth.SmoothGraphics();

    app.stage.addChild(graphics);

    // the same figure for the canvas renderer, which has its own stage
    const stage2 = new PIXI.Container();
    const graphics2 = new PIXI.smooth.SmoothGraphics();

    stage2.addChild(graphics2);

    addLine(graphics, 0);
    addLine(graphics2, 0);

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            graphics.position.x -= 0.05;
        }
        if (e.key === 'ArrowRight') {
            graphics.position.x += 0.05;
        }
        graphics.position.x = Math.min(Math.max(graphics.position.x, 0.0), 8.0);
        graphics2.position.x = graphics.position.x;
    })

    app.ticker.add(() =>
    {
        renderer2.render(stage2);
    });
})();
