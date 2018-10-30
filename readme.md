# image-equal [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges) [![Build Status](https://img.shields.io/travis/dy/image-equal.svg)](https://travis-ci.org/dy/image-equal)

Test if two images are equal. Useful for organising baseline tests for visual webgl/canvas2d components.

## Usage

[![npm install image-equal](https://nodei.co/npm/image-equal.png?mini=true)](https://npmjs.org/package/image-equal/)

```js
let equal = require('image-equal')
let t = require('tape')
let show = require('console-image')

t('image test', async t => {
	t.ok(await equal('./A.png', canvasA))
	t.ok(await equal('./C.png', canvasC, {threshold: 1}))

	// draw to canvas in case of error
	await equal('./B.png', canvasB, show(document.createElement('canvas')))

	t.end()
})
```

### `await imageEqual(imageA, imageB, diffOutput?, options?)`

Takes two image-like arguments and returns a promise that resolves with true when both images are loaded and equal or with false when not equal.

#### `imageA`, `imageB`

Can be any image-like arguments:

* Array, TypedArray
* Image, ImageData, ImageBitmat
* ndarray
* Canvas, Context2D, WebGLContext
* dataURL string
* URL, path
* File, Blob
* ArrayBuffer, Buffer
* Buffer
* ...

#### `options`

Can provide:

* `antialias` − include antialias, by default `false`.
* `threshold` − sensitivity to px difference, 0 - max, 1 - not sensitive.
* `clip` − a sub-area to compare.
* `cache` − cache image data for the URLs, by default `true`.

#### `diffOutput`

Can be:

* an object, obtaining `data` and `count` properties with different pixels.
* an array, obtaining diff pixel data and `count` property with number of different pixels.
* a `canvas` which will obtain diff image data.
* a string with filename to save the difference output.

## See also

* [pixelmatch](https://ghub.io/pixelmatch) — sync image data comparing tool.
* [image-pixels](https://ghub.io/image-pixels) — load pixel data from any source.

## Credits

© 2018 Dmitry Yv. MIT License
