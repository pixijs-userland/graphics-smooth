const app = new PIXI.Application({
    antialias: false,
    width: 800, height: 600,
    autoDensity: true, resolution: 1.0,
});
document.body.appendChild(app.view);

function makeFigures(graphics) {
    const bg = PIXI.Assets.get('bg');
// Rectangle
    for (let i = 0; i < 4; i++) {
        const x = i * 150 + 20;
        const y = 20;
        graphics.beginTextureFill({texture: bg, matrix: new PIXI.Matrix().translate(-x + 10 * (i - 1), -y + 15 * (i - 1))});
        if (i === 2) {
            graphics.lineStyle(10, 0xffffff, 1.0);
        }
        graphics.drawRect(x, y, 100, 100);
        graphics.endFill();
    }
}

PIXI.Assets.add('bg', 'https://pixijs.io/examples/examples/assets/bg_rotate.jpg');
PIXI.Assets.load('bg').then(() => {
    const graphics = new PIXI.smooth.SmoothGraphics();
    makeFigures(graphics);
    app.stage.addChild(graphics);

    const graphics2 = new PIXI.Graphics();
    PIXI.Graphics.prototype.drawStar = PIXI.smooth.SmoothGraphics.prototype.drawStar;
    graphics2.y = 300;
    makeFigures(graphics2);
    app.stage.addChild(graphics2);
})

// const canvasRenderer = new PIXI.CanvasRenderer();
// document.body.appendChild(canvasRenderer.view);
// canvasRenderer.render(app.stage);
