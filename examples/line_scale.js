const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
});

document.body.appendChild(app.view);


function fillGraphics(graphics, scaleMode) {
    graphics.clear();
    graphics.lineStyle({width: 15.0, color: 0xff00ff, scaleMode});
    graphics.drawRect(-150, -150, 300, 300);
    PIXI.smooth.settings.LINE_SCALE_MODE = scaleMode;
    graphics.lineStyle({width: 10.0, color: 0x00ffff});
    graphics.drawCircle(0, 0, 100);
    graphics.endFill();
}

const graphics = new PIXI.smooth.SmoothGraphics();
graphics.position.set(200, 200);
fillGraphics(graphics, PIXI.smooth.LINE_SCALE_MODE.NORMAL);
const graphics2 = new PIXI.smooth.SmoothGraphics();
graphics2.position.set(600, 200);
fillGraphics(graphics2, PIXI.smooth.LINE_SCALE_MODE.NONE);
app.stage.addChild(graphics, graphics2);

let phase = 0;
app.ticker.add((delta) =>
{
    phase += 0.01 * delta;
    graphics.scale.set(Math.exp((Math.sin(phase) - 0.5) * 0.75));
    graphics2.scale.set(Math.exp((Math.sin(phase) - 0.5) * 0.75));
});
