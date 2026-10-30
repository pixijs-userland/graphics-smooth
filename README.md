# PixiJS Smooth Graphics
PixiJS v8 plugin for making smooth shapes using HHAA shader.

[![Automation](https://github.com/pixijs-userland/graphics-smooth/actions/workflows/main.yml/badge.svg)](https://github.com/pixijs-userland/graphics-smooth/actions/workflows/main.yml) [![npm version](https://badge.fury.io/js/%40pixi%2Fgraphics-smooth.svg)](https://badge.fury.io/js/%40pixi%2Fgraphics-smooth)

> **v2 is a work in progress port to PixiJS v8** (requires `pixi.js` >= 8.20).
> For PixiJS v7, use `@pixi/graphics-smooth@1.x`.

### :link: Links

* [Examples](https://userland.pixijs.io/graphics-smooth/examples/index.html)
* [API Docs](https://userland.pixijs.io/graphics-smooth/docs/index.html)

## Features

Smooth edges for lines and fills without MSAA (`antialias: false`), on both WebGL and WebGPU.
On the canvas renderer, `SmoothGraphics` falls back to the regular `Graphics` rendering.

See `examples/v8-compare.html` for a side-by-side comparison with `Graphics`
(append `?renderer=webgpu` to use WebGPU). You have to start a local webserver in the repo folder to view it.

## Usage

`SmoothGraphics` is a drop-in replacement of `Graphics`, it uses the same `GraphicsContext` API.

```js
import { SmoothGraphics } from '@pixi/graphics-smooth';

const graphics = new SmoothGraphics();

graphics
    .moveTo(100, 100)
    .lineTo(200, 200)
    .stroke({ width: 2, color: 0xffffff });

graphics.circle(300, 150, 50).fill(0xff0000);
```

Importing the package registers all the required renderer extensions.

### Line width independent from scale

Use `pixelLine: true` to keep the line width in screen pixels, regardless of the transform
(this replaces `LINE_SCALE_MODE.NONE` of v1). Unlike `Graphics`, the `width` is still honored.

```js
graphics.circle(0, 0, 10).stroke({ width: 2, pixelLine: true });
graphics.scale.set(5); // the circle grows, the stroke stays 2px
```

### Dashed lines

```js
import { DashLineShader, SmoothGraphics } from '@pixi/graphics-smooth';

const graphics = new SmoothGraphics();

graphics.context.customShader = new DashLineShader({ dash: 10, gap: 5 });
graphics.moveTo(0, 0).lineTo(200, 100).stroke({ width: 3, color: 0x000000 });
```

### Fills

Fills are anti-aliased, including concave polygons and shapes with holes (`cut()`).

### Textures, gradients and patterns

Texture fills and strokes, `FillGradient`, `FillPattern` and `graphics.texture()` work like in `Graphics`.
Textured elements use a separate batcher with a bigger vertex format, so they don't make plain colored
graphics heavier.

### Known limitations

* Pixels just outside of very sharp corners of fills can get a little too much coverage.
* With a `DashLineShader`, fills are not drawn: use a separate `SmoothGraphics` for them.

## Performance

Geometry uses 10 floats per vertex in the context, and 14 floats per vertex in the batcher
(20 when textured). Like `Graphics`, small contexts are batched together (their vertices are transformed
on the CPU and uploaded again whenever they move), while large ones (or ones with a `customShader`) are
drawn with their own draw call, their transform being a uniform.

Compared to v1, static scenes and scenes with many small objects are much faster (v1 used one draw call
per object), and other cases are on par, except for rebuilding geometry every frame, which costs about
as much as with v8 `Graphics`. Static scenes render about as fast as with `Graphics`, but HHAA needs more
and bigger vertices, so moving many batched objects costs more. In that case:

* Put containers that are panned or zoomed as a whole in a render group (`container.isRenderGroup = true`):
  moving the group doesn't touch the vertices of its children.
* For many medium sized objects that move individually, `graphics.context.batchMode = 'no-batch'`
  avoids uploading their vertices every frame, at the cost of one draw call each.

## Credits

The v8 port is based on the `SmoothGraphics` implementation from [pixijs/pixijs#12002](https://github.com/pixijs/pixijs/pull/12002),
repackaged as a plugin that doesn't need changes in PixiJS itself.

## Build & Test

```bash
npm install
npm start
```
