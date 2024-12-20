const app = new PIXI.Application({ antialias: false,
    width: 800, height: 600,
    autoDensity: true, resolution: 1.0,
    backgroundColor: 0xffffff
});
document.body.appendChild(app.view);

const graphics = new PIXI.smooth.SmoothGraphics();
app.stage.addChild(graphics);

const graphics2 = new PIXI.Graphics();
PIXI.Graphics.prototype.drawStar = PIXI.smooth.SmoothGraphics.prototype.drawStar;
graphics2.y = 300;
app.stage.addChild(graphics2);

let phase = 0;// -Math.PI/2;

function addLine(graphics, y, len, rad, cap, alignment) {
    graphics.lineStyle({ width: 30, color: 0, alpha: 1, join: PIXI.LINE_JOIN.MITER, cap, alignment});
    graphics.moveTo(150 - len, y);
    graphics.lineTo(150, y);
    graphics.lineTo(150 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);

    graphics.lineStyle({ width: 30, color: 0, alpha: 1, join: PIXI.LINE_JOIN.BEVEL, cap, alignment});
    graphics.moveTo(350 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
    graphics.lineTo(350, y);
    graphics.lineTo(350 - len, y);

    graphics.lineStyle({ width: 30, color: 0, alpha: 1, join: PIXI.LINE_JOIN.ROUND, cap, alignment});
    graphics.moveTo(550 - len, y);
    graphics.lineTo(550, y);
    graphics.lineTo(550 + Math.cos(phase) * rad, y + Math.sin(phase) * rad);
}

function makeFigures(graphics) {
    graphics.clear();

    addLine(graphics, 100, 50, 60, PIXI.LINE_CAP.BUTT, 0);
    addLine(graphics, 200, 50, 60, PIXI.LINE_CAP.ROUND, 0);
}

// graphics.rotation = Math.PI * 3 / 2 - 0.0001;
app.ticker.add((delta) => {
    phase -= 0.008 * delta;
    makeFigures(graphics);
    makeFigures(graphics2);
});
