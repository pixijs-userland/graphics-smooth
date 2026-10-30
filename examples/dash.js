// The dash shader applies to a whole graphics context, and it hides the fills,
// so the dashed lines are drawn into separate graphics on top of the fills.
// PIXI.Graphics doesn't support the dash shader, so it draws everything solid.
function makeFigures(graphics, dashed = graphics, dashed2 = graphics) {
// Rectangle
    graphics.rect(50, 50, 100, 100);
    graphics.fill(0xDE3249);

    graphics.rect(200, 50, 100, 100);
    graphics.fill(0x650A5A);
    dashed.rect(200, 50, 100, 100);
    dashed.stroke({width: 2, color: 0xFEEB77});

// Rectangle + line style 2
    graphics.rect(350, 50, 100, 100);
    graphics.fill(0xC34288);
    graphics.stroke({width: 10, color: 0xFFBD01});

// Rectangle 2
    graphics.rect(530, 50, 140, 100);
    graphics.fill(0xAA4F08);
    dashed.rect(530, 50, 140, 100);
    dashed.stroke({width: 2, color: 0xFFFFFF});

// Circle
    graphics.circle(100, 250, 50);
    graphics.fill({color: 0xDE3249, alpha: 1.0});

// Circle + line style 1
    graphics.circle(250, 250, 50);
    graphics.fill({color: 0x650A5A, alpha: 1});
    dashed.circle(250, 250, 50);
    dashed.stroke({width: 2, color: 0xFEEB77});

// Circle + line style 2
    graphics.circle(400, 250, 50);
    graphics.fill({color: 0xDE3249, alpha: 1.0});
    dashed.circle(400, 250, 50);
    dashed.stroke({width: 10, color: 0xFFBD01});

// Ellipse + line style 2
    graphics.ellipse(600, 250, 80, 50);
    graphics.fill({color: 0xAA4F08, alpha: 1});
    dashed.ellipse(600, 250, 80, 50);
    dashed.stroke({width: 2, color: 0xFFFFFF});

// draw a shape
    const shape = [50, 350, 250, 350, 100, 400, 50, 350];

    graphics.poly(shape);
    graphics.fill(0xFF3300);
    dashed.poly(shape);
    dashed.stroke({width: 4, color: 0xffd900});

// draw a rounded rectangle
    graphics.roundRect(50, 440, 100, 100, 16);
    graphics.fill({color: 0x650A5A, alpha: 0.25});
    dashed.roundRect(50, 440, 100, 100, 16);
    dashed.stroke({width: 2, color: 0xFF00FF});

// draw star
    graphics.star(360, 370, 5, 50);
    graphics.fill({color: 0x35CC5A, alpha: 1});
    dashed.star(360, 370, 5, 50);
    dashed.stroke({width: 2, color: 0xFFFFFF});

// draw star 2
    graphics.star(280, 510, 7, 50);
    graphics.fill({color: 0xFFCC5A, alpha: 1});
    dashed.star(280, 510, 7, 50);
    dashed.stroke({width: 2, color: 0xFFFFFF});

// draw star 3
    graphics.star(470, 450, 4, 50);
    graphics.fill({color: 0x55335A, alpha: 1});
    dashed.star(470, 450, 4, 50);
    dashed.stroke({width: 4, color: 0xFFFFFF});

// draw polygon
    const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

    graphics.poly(path);
    graphics.fill({color: 0x3500FA, alpha: 1.0});
    graphics.stroke({width: 2, color: 0xFFFFFF});

    // draw polygon
    const box = [100, 600, 700, 600, 700, 625, 100, 625];

    graphics.poly(box);
    graphics.fill({color: 0x005A35, alpha: 1.0});
    dashed2.poly(box);
    dashed2.stroke({width: 4, color: 0xFFFFFF});
}

(async () => {
    const app = new PIXI.Application();
    await app.init({ antialias: false,
        width: 800, height: 650 * 2,
        autoDensity: true, resolution: 1.0,
    });
    document.body.appendChild(app.canvas);

    const graphics = new PIXI.smooth.SmoothGraphics();
    const dashed = new PIXI.smooth.SmoothGraphics();
    const dashed2 = new PIXI.smooth.SmoothGraphics();

    dashed.context.customShader = new PIXI.smooth.DashLineShader({dash: 8, gap: 5});
    dashed2.context.customShader = new PIXI.smooth.DashLineShader({dash: 50, gap: 25});
    makeFigures(graphics, dashed, dashed2);
    app.stage.addChild(graphics, dashed, dashed2);

    const graphics2 = new PIXI.Graphics();
    graphics2.y = 650;
    makeFigures(graphics2);
    app.stage.addChild(graphics2);
})();
