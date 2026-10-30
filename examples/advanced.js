function makeFigures(graphics) {
    graphics.moveTo(100, 150);
    graphics.lineTo(600, 150);

    graphics.moveTo(100, 160);
    graphics.lineTo(600, 160);

    graphics.moveTo(100, 170);
    graphics.lineTo(600, 170);

    graphics.stroke({ width: 2, color: 0, alpha: 1 });

    graphics.rotation = 0.06
}

(async () => {
    const app = new PIXI.Application();
    await app.init({ antialias: false,
        width: 800, height: 600,
        background: 0xffffff,
        autoDensity: true, resolution: 1,
    });
    document.body.appendChild(app.canvas);

    const graphics = new PIXI.smooth.SmoothGraphics();
    makeFigures(graphics);
    app.stage.addChild(graphics);

    const graphics2 = new PIXI.Graphics();
    graphics2.y = 300;
    makeFigures(graphics2);
    app.stage.addChild(graphics2);

    const graphics3 = new PIXI.smooth.SmoothGraphics()
        .roundRect(100, 120, 100, 200, 50)
        .fill({ color: 0xff0000, alpha: 1.0 })
        .stroke({ width: 3, color: 0x000000 })
        .roundRect(250, 100, 100, 100, 50)
        .fill({ color: 0x00ff00, alpha: 1.0 })
        .stroke({ width: 3, color: 0x000000 })
        .roundRect(250, 250, 150, 100, 50)
        .fill({ color: 0xffff00, alpha: 1.0 })
        .stroke({ width: 3, color: 0x000000 });
    app.stage.addChild(graphics3);
    graphics3.position.y = 100;
})();
