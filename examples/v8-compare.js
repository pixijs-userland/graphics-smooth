// Side-by-side comparison: left column is PIXI.Graphics, right column is PIXI.smooth.SmoothGraphics.
// Use ?renderer=webgpu to switch renderer, ?resolution=2 to test high DPI.

const ROW = 140;
const COL = 520;

const scenes = [
    ['joints & caps', (g) =>
    {
        const joins = ['miter', 'bevel', 'round'];
        const caps = ['butt', 'round', 'square'];

        for (let i = 0; i < 3; i++)
        {
            const x = 30 + (i * 160);

            g.moveTo(x, 100).lineTo(x + 50, 30).lineTo(x + 100, 100)
                .stroke({ width: 18, color: 0x333333, join: joins[i], cap: caps[i] });
        }
    }],
    ['fills', (g) =>
    {
        g.rect(20, 20, 80, 80).fill(0xe74c3c);
        g.circle(160, 60, 40).fill(0x3498db);
        g.ellipse(260, 60, 50, 30).fill(0x2ecc71);
        g.roundRect(330, 20, 70, 80, 20).fill(0x9b59b6);
        g.star(460, 60, 5, 42, 18).fill(0xf1c40f);
    }],
    ['fills drawn counterclockwise / mirrored', (g) =>
    {
        g.poly([20, 20, 20, 100, 100, 100, 100, 20]).fill(0xe74c3c);
        g.poly([130, 20, 140, 110, 220, 60]).fill(0xe67e22);
        g.context.scale(-1, 1);
        g.circle(-280, 60, 40).fill(0x3498db);
        g.ellipse(-390, 60, 50, 30).fill(0x2ecc71);
        g.roundRect(-500, 20, 70, 80, 20).fill(0x9b59b6);
        g.context.scale(-1, 1);
    }],
    ['holes (cut)', (g) =>
    {
        g.rect(20, 20, 100, 100).fill(0x34495e).circle(70, 70, 30).cut();
        g.circle(200, 70, 50).fill(0x16a085).rect(180, 50, 40, 40).cut();
    }],
    ['thin lines', (g) =>
    {
        [0.5, 1, 1.5, 2, 3].forEach((w, i) =>
        {
            const x = 20 + (i * 95);

            g.moveTo(x, 110).lineTo(x + 80, 20).stroke({ width: w, color: 0x000000 });
            g.circle(x + 40, 65, 30).stroke({ width: w, color: 0xc0392b });
        });
    }],
    ['curves', (g) =>
    {
        g.moveTo(20, 110).bezierCurveTo(80, -20, 160, 200, 240, 30).stroke({ width: 6, color: 0x2980b9 });
        g.arc(360, 70, 50, 0, Math.PI * 1.5).stroke({ width: 10, color: 0x8e44ad, cap: 'round' });
    }],
    ['stroke alignment 1 / 0.5 / 0', (g) =>
    {
        [1, 0.5, 0].forEach((a, i) =>
        {
            const x = 30 + (i * 160);

            g.rect(x, 30, 90, 80).fill(0xbdc3c7);
            g.rect(x, 30, 90, 80).stroke({ width: 12, color: 0xe67e22, alpha: 0.7, alignment: a });
        });
    }],
    ['alignment 1 with CW / CCW winding', (g) =>
    {
        g.poly([30, 30, 140, 30, 140, 110, 30, 110]).fill(0xbdc3c7)
            .stroke({ width: 12, color: 0xe67e22, alpha: 0.7, alignment: 1 });
        g.poly([200, 30, 200, 110, 310, 110, 310, 30]).fill(0xbdc3c7)
            .stroke({ width: 12, color: 0xe67e22, alpha: 0.7, alignment: 1 });
        g.circle(410, 70, 40).fill(0xbdc3c7).stroke({ width: 12, color: 0xe67e22, alpha: 0.7, alignment: 1 });
    }],
    ['texture fill / local space / stroke / graphics.texture()', (g) =>
    {
        const texture = getChecker();

        g.circle(60, 70, 50).fill({ texture });
        g.rect(130, 20, 100, 100).fill({ texture, textureSpace: 'local' });
        g.roundRect(250, 25, 90, 90, 20).stroke({ texture, width: 14 });
        g.texture(texture, 0xffffff, 360, 20, 100, 100);
    }],
    ['gradients / pattern', (g) =>
    {
        const linear = new PIXI.FillGradient({
            type: 'linear', start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
            colorStops: [{ offset: 0, color: 0xe74c3c }, { offset: 1, color: 0x3498db }],
        });
        const radial = new PIXI.FillGradient({
            type: 'radial', center: { x: 0.5, y: 0.5 }, innerRadius: 0, outerCenter: { x: 0.5, y: 0.5 }, outerRadius: 0.5,
            colorStops: [{ offset: 0, color: 0xf1c40f }, { offset: 1, color: 0x8e44ad }],
        });
        const pattern = new PIXI.FillPattern(getChecker(), 'repeat');

        g.star(70, 70, 5, 55, 25).fill(linear);
        g.circle(200, 70, 50).fill(radial);
        g.poly([280, 20, 400, 30, 360, 120, 270, 110]).fill(pattern);
        g.moveTo(420, 30).lineTo(500, 110).stroke({ width: 16, fill: linear, cap: 'round' });
    }],
    ['transparent overlap', (g) =>
    {
        g.moveTo(20, 30).lineTo(300, 110).lineTo(300, 30).lineTo(20, 110)
            .stroke({ width: 20, color: 0x27ae60, alpha: 0.5, join: 'round' });
    }],
];

let checker = null;

/** A small checkerboard texture, generated so that the example doesn't need any asset */
function getChecker()
{
    if (!checker)
    {
        const canvas = document.createElement('canvas');

        canvas.width = canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#16a085';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillRect(16, 16, 16, 16);
        checker = PIXI.Texture.from(canvas);
    }

    return checker;
}

(async () =>
{
    const params = new URLSearchParams(location.search);
    const app = new PIXI.Application();

    await app.init({
        preference: params.get('renderer') || 'webgl',
        antialias: false,
        resolution: Number(params.get('resolution')) || 1,
        autoDensity: true,
        width: COL * 2,
        height: (ROW * scenes.length) + 120,
        background: 0xffffff,
    });
    document.body.appendChild(app.canvas);
    window.app = app;

    const label = (text, x, y) =>
    {
        const t = new PIXI.Text({ text, style: { fontSize: 14, fill: 0x666666 } });

        t.position.set(x, y);
        app.stage.addChild(t);
    };

    label(`PIXI.Graphics (${app.renderer.name})`, 10, 4);
    label('PIXI.smooth.SmoothGraphics', COL + 10, 4);

    scenes.forEach(([name, draw], i) =>
    {
        const y = 20 + (i * ROW);

        label(name, 10, y);

        const native = new PIXI.Graphics();

        native.y = y;
        draw(native);
        app.stage.addChild(native);

        const smooth = new PIXI.smooth.SmoothGraphics();

        smooth.position.set(COL, y);
        draw(smooth);
        app.stage.addChild(smooth);
    });

    // Scaled + rotated: same geometry, scaled by 3 and rotated
    const y = 20 + (scenes.length * ROW);

    label('scaled x3 + rotated / dashed', 10, y);
    for (const [Ctor, x] of [[PIXI.Graphics, 60], [PIXI.smooth.SmoothGraphics, COL + 60]])
    {
        const g = new Ctor();

        g.circle(0, 0, 10).stroke({ width: 1, color: 0x000000 });
        g.moveTo(-12, -12).lineTo(12, 12).stroke({ width: 0.5, color: 0xc0392b });
        g.scale.set(3);
        g.rotation = 0.3;
        g.position.set(x, y + 60);
        app.stage.addChild(g);
    }

    const dashed = new PIXI.smooth.SmoothGraphics();

    dashed.context.customShader = new PIXI.smooth.DashLineShader({ dash: 10, gap: 6 });
    dashed.moveTo(0, 0).lineTo(200, 0).lineTo(300, 60)
        .stroke({ width: 3, color: 0x2c3e50 });
    dashed.circle(250, 60, 30).stroke({ width: 2, color: 0x2c3e50 });
    dashed.position.set(COL + 140, y + 30);
    app.stage.addChild(dashed);

    // 4x pixelated close-ups of edges: PIXI.Graphics on top, SmoothGraphics below
    const zoom = document.createElement('div');

    zoom.style.cssText = 'padding:10px;display:flex;flex-direction:column;gap:6px';
    zoom.innerHTML = '<div style="color:#666">4x close-up: PIXI.Graphics (top) / SmoothGraphics (bottom)</div>';
    for (const Ctor of [PIXI.Graphics, PIXI.smooth.SmoothGraphics])
    {
        const g = new Ctor();

        g.circle(50.3, 50, 45).fill(0x3498db);
        g.rect(110, 5, 90, 90).fill(0x34495e).circle(155, 50, 28).cut();
        g.poly([220, 10, 320, 20, 270, 60, 320, 100, 210, 95]).fill({ color: 0xff0000, alpha: 0.5 });
        g.moveTo(340, 90).lineTo(380, 10).lineTo(420, 90).stroke({ width: 1, color: 0x000000 });
        g.circle(470, 50, 35).stroke({ width: 3, color: 0x8e44ad });

        const cv = app.renderer.extract.canvas({ target: g, frame: new PIXI.Rectangle(0, 0, 520, 100), clearColor: 0xffffff });

        cv.style.cssText = 'width:2080px;height:400px;image-rendering:pixelated;border:1px solid #ccc';
        zoom.appendChild(cv);
        g.destroy();
    }
    document.body.appendChild(zoom);

    // WebGPU canvases can't be captured by some screenshot tools, so optionally swap in a static image
    if (params.has('snapshot'))
    {
        app.render();
        const img = new Image();

        img.src = await app.renderer.extract.base64({ target: app.stage, frame: app.screen, clearColor: 0xffffff });
        app.canvas.replaceWith(img);
        app.stop();
    }
})();
