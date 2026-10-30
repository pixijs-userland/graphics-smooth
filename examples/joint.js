let phase = 0;// -Math.PI/2;

function addLine(graphics, y, len, rad, cap) {
    graphics.moveTo(150 - len, y);
    graphics.lineTo(150, y);
    graphics.lineTo(150 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    graphics.stroke({ width: 30, color: 0, alpha: 1, join: 'miter', cap });

    graphics.moveTo(350 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    graphics.lineTo(350, y);
    graphics.lineTo(350 - len, y);
    graphics.stroke({ width: 30, color: 0, alpha: 1, join: 'bevel', cap });

    graphics.moveTo(550 - len, y);
    graphics.lineTo(550, y);
    graphics.lineTo(550 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    graphics.stroke({ width: 30, color: 0, alpha: 1, join: 'round', cap });
}

function makeFigures(graphics) {
    graphics.clear();

    addLine(graphics, 100, 50, 60, 'butt');
    addLine(graphics, 200, 50, 60, 'round');
}

(async () => {
    const app = new PIXI.Application();
    await app.init({ antialias: false,
        width: 800, height: 600,
        autoDensity: true, resolution: 1.0,
        background: 0xffffff
    });
    document.body.appendChild(app.canvas);

    const graphics = new PIXI.smooth.SmoothGraphics();
    app.stage.addChild(graphics);

    const graphics2 = new PIXI.Graphics();
    graphics2.y = 300;
    app.stage.addChild(graphics2);

    // graphics.rotation = Math.PI * 3 / 2 - 0.0001;
    app.ticker.add((ticker) => {
        phase -= 0.008 * ticker.deltaTime;
        makeFigures(graphics);
        makeFigures(graphics2);
    });
})();
