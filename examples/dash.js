const app = new PIXI.Application({ antialias: false,
    width: 800, height: 650 * 2,
    autoDensity: true, resolution: 1.0,
});
document.body.appendChild(app.view);

const shader = new PIXI.smooth.DashLineShader({dash: 8, gap: 5});
const shader2 = new PIXI.smooth.DashLineShader({dash: 50, gap: 25});

function makeFigures(graphics) {
// Rectangle
    graphics.beginFill(0xDE3249);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();

    graphics.lineStyle({width: 2, color: 0xFEEB77, shader});
    graphics.beginFill(0x650A5A);
    graphics.drawRect(200, 50, 100, 100);
    graphics.endFill();

// Rectangle + line style 2
    graphics.lineStyle({width: 10, color: 0xFFBD01});
    graphics.beginFill(0xC34288);
    graphics.drawRect(350, 50, 100, 100);
    graphics.endFill();

// Rectangle 2
    graphics.lineStyle({width: 2, color: 0xFFFFFF, shader});
    graphics.beginFill(0xAA4F08);
    graphics.drawRect(530, 50, 140, 100);
    graphics.endFill();

// third param for beginFIll, smooth param should be set for fill, if lineStyle doesnt cover the edges of fill
// Circle
    graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(0xDE3249, 1.0, true);
    graphics.drawCircle(100, 250, 50);
    graphics.endFill();

// Circle + line style 1
    graphics.lineStyle({width: 2, color: 0xFEEB77, shader});
    graphics.beginFill(0x650A5A, 1);
    graphics.drawCircle(250, 250, 50);
    graphics.endFill();

// Circle + line style 2
    graphics.lineStyle({width: 10, color: 0xFFBD01, shader});
    graphics.beginFill(0xDE3249, 1.0, true);
    graphics.drawCircle(400, 250, 50);
    graphics.endFill();

// Ellipse + line style 2
    graphics.lineStyle({width: 2, color: 0xFFFFFF, shader});
    graphics.beginFill(0xAA4F08, 1);
    graphics.drawEllipse(600, 250, 80, 50);
    graphics.endFill();

// draw a shape
    graphics.beginFill(0xFF3300);
    graphics.lineStyle({width: 4, color: 0xffd900, shader});
    graphics.moveTo(50, 350);
    graphics.lineTo(250, 350);
    graphics.lineTo(100, 400);
    graphics.lineTo(50, 350);
    graphics.closePath();
    graphics.endFill();

// draw a rounded rectangle
    graphics.lineStyle({width: 2, color: 0xFF00FF, shader});
    graphics.beginFill(0x650A5A, 0.25);
    graphics.drawRoundedRect(50, 440, 100, 100, 16);
    graphics.endFill();

// draw star
    graphics.lineStyle({width: 2, color: 0xFFFFFF, shader});
    graphics.beginFill(0x35CC5A, 1);
    graphics.drawStar(360, 370, 5, 50);
    graphics.endFill();

// draw star 2
    graphics.lineStyle({width: 2, color: 0xFFFFFF, shader});
    graphics.beginFill(0xFFCC5A, 1);
    graphics.drawStar(280, 510, 7, 50);
    graphics.endFill();

// draw star 3
    graphics.lineStyle({width: 4, color: 0xFFFFFF, shader});
    graphics.beginFill(0x55335A, 1);
    graphics.drawStar(470, 450, 4, 50);
    graphics.endFill();

// draw polygon
    const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

    graphics.lineStyle({width: 2, color: 0xFFFFFF});
    graphics.beginFill(0x3500FA, 1.0, true);
    graphics.drawPolygon(path);
    graphics.endFill();

    // draw polygon
    const box = new PIXI.Polygon([100, 600, 700, 600, 700, 625, 100, 625]);

    graphics.lineStyle({width: 4, color: 0xFFFFFF, shader: shader2});
    graphics.beginFill(0x005A35, 1.0, true);
    graphics.drawPolygon(box);
    graphics.endFill();
}

PIXI.smooth.SmoothGraphics.prototype.drawStar = PIXI.Graphics.prototype.drawStar;

const graphics = new PIXI.smooth.SmoothGraphics();
makeFigures(graphics);
app.stage.addChild(graphics);

const graphics2 = new PIXI.Graphics();
graphics2.y = 650;
makeFigures(graphics2);
app.stage.addChild(graphics2);

// const canvasRenderer = new PIXI.CanvasRenderer();
// document.body.appendChild(canvasRenderer.view);
// canvasRenderer.render(app.stage);
