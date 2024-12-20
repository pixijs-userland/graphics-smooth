const app = new PIXI.Application({
    antialias: false,
    width: 48,
    height: 16,
    resolution: 2,
    backgroundColor: 0xffffff
});
const renderer2 = new PIXI.CanvasRenderer({
    width: 48,
    height: 16,
    backgroundColor: 0xffffff,
    resolution: 2,
});

PIXI.smooth.settings.PIXEL_LINE = 1;

document.body.appendChild(app.view);
document.body.appendChild(renderer2.view);
app.view.style['image-rendering'] = 'pixelated'
app.view.style.width = '960px';
app.view.style.height = '320px';
app.view.style.display = 'block';
renderer2.view.style['image-rendering'] = 'pixelated'
renderer2.view.style.width = '960px';
renderer2.view.style.height = '320px';
renderer2.view.style.display = 'block';

const graphics = new PIXI.smooth.SmoothGraphics();

app.stage.addChild(graphics);

function addLine(graphics, y)
{
    graphics.clear();
    graphics.lineStyle({
        width: 3,
        color: 0,
        alpha: 1,
    });
    graphics.moveTo(2, y + 2);
    graphics.lineTo(14, y + 14);

    graphics.lineStyle({
        width: 8,
        color: 0,
        alpha: 1,
        cap: PIXI.LINE_CAP.ROUND
    });
    graphics.moveTo(16 + 6, y + 8);
    graphics.lineTo(16 + 10, y + 8);
    graphics.lineStyle({
        width: 2,
        color: 0,
        alpha: 1,
    });
    graphics.moveTo(32 + 4, y + 2);
    graphics.lineTo(32 + 4, y + 14);
}

addLine(graphics, 0);

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        graphics.position.x -= 0.05;
    }
    if (e.key === 'ArrowRight') {
        graphics.position.x += 0.05;
    }
    graphics.position.x = Math.min(Math.max(graphics.position.x, 0.0), 8.0);
})

app.ticker.add((delta) =>
{
    renderer2.render(app.stage);
});
