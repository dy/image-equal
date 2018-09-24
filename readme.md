# image-equal [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges) [![Build Status](https://img.shields.io/travis/dy/image-equal.svg)](https://travis-ci.org/dy/image-equal)

Test if two images are equal. Useful for organising baseline tests for visual webgl/canvas2d components.

## Usage

[![npm install image-equal](https://nodei.co/npm/image-equal.png?mini=true)](https://npmjs.org/package/image-equal/)

```js
let imageEqual = require('@dy/image-equal')
let t = require('tape')
let show = require('console-image')

t('image test', t => {
	imageEqual('./A.png', canvasA).catch(t.fail)
	imageEqual('./B.png', canvasB).catch({count, data, canvas} => show(canvas))
	imageEqual('./C.png', canvasC, {threshold: 1}).then(t.end, t.fail)
})
```

## imageEqual(imageA, imageB, options?).then(pass, fail)

Takes two image-like arguments and returns a promise that resolves when both images are loaded and equal.

`imageA`, `imageB` can be any image-like argument:

* Array
* Array of Arrays
* ImageData
* TypedArray
* ndarray
* Canvas
* Context2D
* WebGLContext
* Image
* base64 string
* dataURL string
* URL
* File
* Blob
* ArrayBuffer
* Buffer
* ...

`options` can define [_pixelmatch_](https://ghub.io/pixelmatch) options: `{ antialias: true, threshold: 0..1 }`.

`fail` gets `{count, data, canvas}` object, where `count` is number of different pixels, `data` is Uint8Array and `canvas` is canvas with diff data in it (browser only).

## Credits

© 2018 Dmitry Yv. MIT License
