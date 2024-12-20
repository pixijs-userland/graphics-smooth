const app = new PIXI.Application({ antialias: false,
    width: 800, height: 600,
    backgroundColor: 0xffffff,
    autoDensity: true, resolution: 1,
});
document.body.appendChild(app.view);

function makeFigures(graphics) {
    graphics.lineStyle(10, 0, 0.5);

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
}

const graphics = new PIXI.smooth.SmoothGraphics();
makeFigures(graphics);
app.stage.addChild(graphics);

const graphics2 = new PIXI.Graphics();
PIXI.Graphics.prototype.drawStar = PIXI.smooth.SmoothGraphics.prototype.drawStar;
graphics2.y = 300;
makeFigures(graphics2);
app.stage.addChild(graphics2);

// const canvasRenderer = new PIXI.CanvasRenderer();
// document.body.appendChild(canvasRenderer.view);
// canvasRenderer.render(app.stage);
