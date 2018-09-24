# image-equal

Test if two images are equal. Useful for organising baseline tests for visual webgl/canvas2d components.

```js
let imEqual = require('@dy/image-equal')
let t = require('tape')
let show = require('console-image')

t('image test', t => {
	imEqual('./A.png', canvasA).catch(t.fail)
	imEqual('./B.png', canvasB).catch({count, data, canvas} => show(canvas))
	imEqual('./C.png', canvasC, {threshold: 1}).then(t.end, t.fail)
})
```

## imEqual(a, b, o?).then(ok, nok)

Takes two image-like arguments and returns a promise that resolves when both images are loaded and equal.

`a`, `b` can be any image-like argument:

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
* add your own

`o` can define [_pixelmatch_](https://ghub.io/pixelmatch) options: `{ antialias: true, threshold: 0..1 }`.

`nok` gets `{count, data, canvas}` object, where `count` is number of different pixels, `data` is Uint8Array and `canvas` is canvas with diff data in it (browser only).

## © dy
