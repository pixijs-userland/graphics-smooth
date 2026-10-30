function makeFigures(graphics) {
    graphics.moveTo(100, 50);
    graphics.lineTo(600, 50);
    graphics.lineTo(100, 50);
    graphics.lineTo(600, 50);

    graphics.moveTo(100, 100);
    graphics.lineTo(400, 100);
    graphics.lineTo(300, 100);
    graphics.lineTo(600, 100);

    graphics.moveTo(100, 150);
    graphics.lineTo(300, 150);
    graphics.lineTo(400, 150);
    graphics.lineTo(600, 150);

    graphics.moveTo(150, 200);
    graphics.lineTo(100, 250);
    graphics.lineTo(200, 250);
    graphics.lineTo(120, 250);
    graphics.lineTo(220, 300);

    graphics.stroke({ width: 10, color: 0, alpha: 0.5 });
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
})();
