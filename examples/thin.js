const app = new PIXI.Application({
  width: 600,
  height: 600,
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true
});

document.body.appendChild(app.view);

const graphics = new PIXI.smooth.SmoothGraphics();
graphics.pivot = { x: 300, y: 300 };
graphics.position = { x: 300, y: 300 };

// Rectangle
graphics.lineStyle(0.1, 0, 1);

graphics.drawRect(150, 150, 300, 300);
graphics.endFill();

app.stage.addChild(graphics);

// graphics.rotation = Math.PI * 3 / 2 - 0.0001;
app.ticker.add((delta) => {
  graphics.rotation -= 0.004 * delta;
});
