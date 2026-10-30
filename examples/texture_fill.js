function makeFigures(graphics) {
    const bg = PIXI.Assets.get('bg');
// Rectangle
    for (let i = 0; i < 4; i++) {
        const x = i * 150 + 20;
        const y = 20;
        graphics.rect(x, y, 100, 100);
        graphics.fill({texture: bg, matrix: new PIXI.Matrix().translate(-x + 10 * (i - 1), -y + 15 * (i - 1)), textureSpace: 'global'});
        // in v7 the line style was kept for the following shapes
        if (i >= 2) {
            graphics.stroke({width: 10, color: 0xffffff, alpha: 1.0});
        }
    }
}

(async () => {
    const app = new PIXI.Application();
    await app.init({
        antialias: false,
        width: 800, height: 600,
        autoDensity: true, resolution: 1.0,
    });
    document.body.appendChild(app.canvas);

    PIXI.Assets.add({alias: 'bg', src: 'https://pixijs.io/examples/examples/assets/bg_rotate.jpg'});
    await PIXI.Assets.load('bg');

    const graphics = new PIXI.smooth.SmoothGraphics();
    makeFigures(graphics);
    app.stage.addChild(graphics);

    const graphics2 = new PIXI.Graphics();
    graphics2.y = 300;
    makeFigures(graphics2);
    app.stage.addChild(graphics2);
})();
