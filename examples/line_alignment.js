const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
});

document.body.appendChild(app.view);

function fillGraphics(graphics, alignment1, alignment2) {
    graphics.clear();
    graphics.lineStyle({width: 15.0, color: 0xff00ff, alignment: alignment1 });
    graphics.drawRect(-150, -150, 300, 300);
    graphics.lineStyle({width: 10.0, color: 0x00ffff, alignment: alignment2 });
    graphics.drawCircle(0, 0, 100);
    graphics.endFill();
}

const graphics = new PIXI.smooth.SmoothGraphics();
graphics.position.set(200, 200);
const graphics2 = new PIXI.Graphics();
graphics2.position.set(600, 200);
app.stage.addChild(graphics, graphics2);

let phase = 0;
app.ticker.add((delta) =>
{
    phase += 0.01 * delta;
    const s = (Math.sin(phase) - 1.0) * 0.5;

    fillGraphics(graphics, s, -s);
    fillGraphics(graphics2, s, -s);
});
