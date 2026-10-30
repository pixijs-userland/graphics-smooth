// pixelLine: true keeps the line width independent of the scale (LINE_SCALE_MODE.NONE in v7)
function fillGraphics(graphics, pixelLine) {
    graphics.clear();
    graphics.rect(-150, -150, 300, 300);
    graphics.stroke({width: 15.0, color: 0xff00ff, pixelLine});
    graphics.circle(0, 0, 100);
    graphics.stroke({width: 10.0, color: 0x00ffff, pixelLine});
}

(async () => {
    const app = new PIXI.Application();
    await app.init({
        width: 800,
        height: 600,
        background: 0x0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });

    document.body.appendChild(app.canvas);

    const graphics = new PIXI.smooth.SmoothGraphics();
    graphics.position.set(200, 200);
    fillGraphics(graphics, false);
    const graphics2 = new PIXI.smooth.SmoothGraphics();
    graphics2.position.set(600, 200);
    fillGraphics(graphics2, true);
    app.stage.addChild(graphics, graphics2);

    let phase = 0;
    app.ticker.add((ticker) =>
    {
        phase += 0.01 * ticker.deltaTime;
        graphics.scale.set(Math.exp((Math.sin(phase) - 0.5) * 0.75));
        graphics2.scale.set(Math.exp((Math.sin(phase) - 0.5) * 0.75));
    });
})();
