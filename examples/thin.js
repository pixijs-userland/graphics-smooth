(async () => {
  const app = new PIXI.Application();
  await app.init({
    width: 600,
    height: 600,
    background: 0xffffff,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  });

  document.body.appendChild(app.canvas);

  const graphics = new PIXI.smooth.SmoothGraphics();
  graphics.pivot = { x: 300, y: 300 };
  graphics.position = { x: 300, y: 300 };

  // Rectangle
  graphics.rect(150, 150, 300, 300);
  graphics.stroke({ width: 0.1, color: 0, alpha: 1 });

  app.stage.addChild(graphics);

  // graphics.rotation = Math.PI * 3 / 2 - 0.0001;
  app.ticker.add((ticker) => {
    graphics.rotation -= 0.004 * ticker.deltaTime;
  });
})();
