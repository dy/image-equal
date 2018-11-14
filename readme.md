# image-equal [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges) [![Build Status](https://img.shields.io/travis/dy/image-equal.svg)](https://travis-ci.org/dy/image-equal)

Test if two images are equal. Useful for organising baseline tests for visual components.

## Usage

[![npm install image-equal](https://nodei.co/npm/image-equal.png?mini=true)](https://npmjs.org/package/image-equal/)

```js
let t = require('tape')
let equal = require('image-equal')
let pixels = require('image-pixels')

t('image test', async t => {
	t.ok(equal(await pixels('./a.png'), canvasA))
	t.ok(equal(await pixels('./b.png'), canvasB, {threshold: .2}))

	// display diff to console in case of mismatch
	t.ok(equal(await pixels('./c.png'), canvasC, true))

	t.end()
})
```

### `equal(imageA, imageB, diff?, threshold|options?)`

Takes two images and returns `true` if they're similar and `false` otherwise, optionally sending diff stats to `diff` output. `options` can adjust comparison logic.

#### `imageA`, `imageB`

Shoud be actual image data container, usually loaded with [`image-pixels`](https://ghub.io/image-pixels), one of:

* _Canvas_, _Context2D_, _WebGLContext_
* _ImageData_ or _Object_ `{data, width, height}`
* DataURL or Base64 string
* _Image_, _Video_, _ImageBitmap_ with resolved data
* _Context2D_, _WebGLContext_, _Canvas_
* _Array_, _Array_ of _Arrays_, _UintArray_s, _FloatArray_s with raw pixels
* _ArrayBuffer_, _Buffer_
* _Ndarray_

To use eventual image data, like URL, path, _ImageBitmap_, _Promise_, incomplete _Image_/_Video_, _Stream_, _Blob_ and alike, use [image-pixels](https://ghub.io/image-pixels):

```js
const equal = require('image-equal')
const load = require('image-pixels')
equal(...(await load.all('./a.png', './b.png')),
```

#### `diff`

Can be one of:

Type | Meaning
---|---
`Bool` | Show diff data to console, by default `false`.
`console` | Send diff data to console, same as `true`.
`Canvas2D`, `Context2D` | Put diff pixels to a canvas.
filename `String` | Write diff data to a file or filepath. In browser downloads the file.
`ImageData` | Write diff data to _ImageData_ object.
`Array`, `TypedArray` | Write diff pixels data to target array.
`Stream` | Send data to stream, same as `console` in case of `process.stdout`.
`function` | Call function with diff data object.
`Object` | Put data properties on object: `data`, `count`, `ids`, `amount` from `0..1` range.

#### `options`

Property | Meaning
---|---
`antialias` | Include antialias, by default `false`.
`threshold` | Sensitivity to px difference, 0 - intolerant, 1 - not sensitive.
`clip` | A sub-area to compare, rectangle `[left, top, width, height]`.

## See also

* [image-pixels](https://ghub.io/image-pixels) — load or save pixel data from any source.
* [image-output](https://ghub.io/image-output) — output pixels data into any destination.
* [pixelmatch](https://ghub.io/pixelmatch) − fuzzy image comparison tool.

## Credits

© 2018 Dmitry Yv. MIT License
