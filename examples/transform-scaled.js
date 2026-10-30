(async () => {
    const app = new PIXI.Application();
    await app.init({ antialias: false,
        width: 800, height: 600,
        background: 0xffffff,
        autoDensity: true, resolution: 1,
        autoStart: false,
    });
    document.body.appendChild(app.canvas);

    const stage = new PIXI.Container()

    // Smooth rectangle
    const smoothGraphic = new PIXI.smooth.SmoothGraphics();

    smoothGraphic.rect(20, 20, 50, 50);
    smoothGraphic.stroke({ width: 5, color: 0, alpha: 1 });

    stage.addChild(smoothGraphic);

    // Original rectangle
    const graphics = new PIXI.Graphics();

    graphics.rect(100, 20, 50, 50);
    graphics.stroke({ width: 5, color: 0, alpha: 1 });

    stage.addChild(graphics);

    const transform = new PIXI.Matrix();
    transform.scale(5, 5)

    app.renderer.render({
        container: stage,
        transform
    });
})();
