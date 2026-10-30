function fillGraphics(graphics, alignment1, alignment2) {
    graphics.clear();
    graphics.rect(-150, -150, 300, 300);
    graphics.stroke({width: 15.0, color: 0xff00ff, alignment: alignment1 });
    graphics.circle(0, 0, 100);
    graphics.stroke({width: 10.0, color: 0x00ffff, alignment: alignment2 });
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
    const graphics2 = new PIXI.Graphics();
    graphics2.position.set(600, 200);
    app.stage.addChild(graphics, graphics2);

    let phase = 0;
    app.ticker.add((ticker) =>
    {
        phase += 0.01 * ticker.deltaTime;
        // both alignments sweep the whole [0, 1] range, in opposite directions
        const s = (Math.sin(phase) + 1.0) * 0.5;

        fillGraphics(graphics, s, 1 - s);
        fillGraphics(graphics2, s, 1 - s);
    });
})();
