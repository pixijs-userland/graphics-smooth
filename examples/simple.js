function makeFigures(graphics) {
// Rectangle
    graphics.rect(50, 50, 100, 100);
    graphics.fill(0xDE3249);

// Rectangle + line style 1
    graphics.rect(200, 50, 100, 100);
    graphics.fill(0x650A5A);
    graphics.stroke({ width: 2, color: 0xFEEB77, alpha: 1 });

// Rectangle + line style 2
    graphics.rect(350, 50, 100, 100);
    graphics.fill(0xC34288);
    graphics.stroke({ width: 10, color: 0xFFBD01, alpha: 1 });

// Rectangle 2
    graphics.rect(530, 50, 140, 100);
    graphics.fill(0xAA4F08);
    graphics.stroke({ width: 2, color: 0xFFFFFF, alpha: 1 });

// Circle
    graphics.circle(100, 250, 50);
    graphics.fill({ color: 0xDE3249, alpha: 1.0 });

// Circle + line style 1
    graphics.circle(250, 250, 50);
    graphics.fill({ color: 0x650A5A, alpha: 1 });
    graphics.stroke({ width: 2, color: 0xFEEB77, alpha: 1 });

// Circle + line style 2
    graphics.circle(400, 250, 50);
    graphics.fill({ color: 0xDE3249, alpha: 1.0 });
    graphics.stroke({ width: 10, color: 0xFFBD01, alpha: 0.5 });

// Ellipse + line style 2
    graphics.ellipse(600, 250, 80, 50);
    graphics.fill({ color: 0xAA4F08, alpha: 1 });
    graphics.stroke({ width: 2, color: 0xFFFFFF, alpha: 1 });

// Ellipse
    graphics.ellipse(700, 350, 40, 25);
    graphics.fill({ color: 0x4F08AA, alpha: 1 });

// draw a shape
    graphics.moveTo(50, 350);
    graphics.lineTo(250, 350);
    graphics.lineTo(100, 400);
    graphics.lineTo(50, 350);
    graphics.closePath();
    graphics.fill(0xFF3300);
    graphics.stroke({ width: 4, color: 0xffd900, alpha: 1 });

// draw a rounded rectangle
    graphics.roundRect(50, 440, 100, 100, 16);
    graphics.fill({ color: 0x650A5A, alpha: 0.25 });
    graphics.stroke({ width: 2, color: 0xFF00FF, alpha: 1 });

// draw star
    graphics.star(360, 370, 5, 50);
    graphics.fill({ color: 0x35CC5A, alpha: 1 });
    graphics.stroke({ width: 2, color: 0xFFFFFF });

// draw star 2
    graphics.star(280, 510, 7, 50);
    graphics.fill({ color: 0xFFCC5A, alpha: 1 });
    graphics.stroke({ width: 2, color: 0xFFFFFF });

// draw star 3
    graphics.star(470, 450, 4, 50);
    graphics.fill({ color: 0x55335A, alpha: 1 });
    graphics.stroke({ width: 4, color: 0xFFFFFF });

// draw polygon (open stroke)
    const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

    graphics.poly(path, false);
    graphics.fill({ color: 0x3500FA, alpha: 1.0 });
    graphics.stroke({ width: 4, color: 0xFFFFFF });
}

(async () => {
    const app = new PIXI.Application();
    await app.init({ antialias: false,
        width: 800, height: 600 * 2,
        autoDensity: true, resolution: 1.0,
    });
    document.body.appendChild(app.canvas);

    const graphics = new PIXI.smooth.SmoothGraphics();
    makeFigures(graphics);
    app.stage.addChild(graphics);

    const graphics2 = new PIXI.Graphics();
    graphics2.y = 600;
    makeFigures(graphics2);
    app.stage.addChild(graphics2);
})();
