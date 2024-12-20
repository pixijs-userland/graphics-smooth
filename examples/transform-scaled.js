const app = new PIXI.Application({ antialias: false,
    width: 800, height: 600,
    backgroundColor: 0xffffff,
    autoDensity: true, resolution: 1,
    autoStart: false,
});
document.body.appendChild(app.view);

const stage = new PIXI.Container()

// Smooth rectangle
const smoothGraphic = new PIXI.smooth.SmoothGraphics();

smoothGraphic.lineStyle(5, 0, 1);
smoothGraphic.drawRect(20, 20, 50, 50);
smoothGraphic.endFill();

stage.addChild(smoothGraphic);

// Original rectangle
const graphics = new PIXI.Graphics();

graphics.lineStyle(5, 0, 1);
graphics.drawRect(100, 20, 50, 50);
graphics.endFill();

stage.addChild(graphics);

const transform = new PIXI.Matrix();
transform.scale(5, 5)

app.renderer.render(stage, {
    transform
});

// const canvasRenderer = new PIXI.CanvasRenderer();
// document.body.appendChild(canvasRenderer.view);
// canvasRenderer.render(app.stage);
