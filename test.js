'use strict'

let eq = require('./')
let t = require('tape')
let load = require('image-pixels')
let fix = require('./fixture')
var isBrowser = require('is-browser')
let output = require('image-output')
let del = require('del')

t('2 raw arrays', t => {
	t.ok(eq([0,0,0,1,1,1,1,1], [0,0,0,1,1,1,1,1]))

	var diff = {}
	t.notOk(eq([0,0,0,1,1,1,1,1], [0,0,1,1,1,1,1,1], diff))
	t.equal(diff.count, 1)
	t.deepEqual(diff.ids, [0])
	t.deepEqual(diff.amount, 1/8)
	t.end()
})

t('DOM containers: file, blob, imagebitmap, image', async t => {
	if (!isBrowser) return t.end()

	t.plan(6)

	fix.canvas2d.toBlob(async function (blob) {
		let file = new File([blob], 'x.png')
		let bmpromise = createImageBitmap(blob)
		let bm = await bmpromise
		let canvas = fix.canvas2d
		let idata = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height)

		t.ok(eq(bm, fix))
		t.ok(eq(canvas, fix))
		t.ok(eq(idata, fix.data))

		var out = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height)
		idata.data[12] = 0
		t.notOk(eq(idata, fix, out))
		t.ok(out.count, 1)

		let im = new Image()
		im.src = fix.pngDataURL
		im.onload = function () {
			t.ok(eq(im, fix.data))
			t.end()
		}
	})
})

t('threshold', t => {
	var data = [0,0,0,255,0,0,0,255]
	var data2 = data.slice()
	data2[0] = 1

	t.notOk(eq(data, data2, 0))
	t.ok(eq(data, data2, .01))
	t.ok(eq(data, data2, {threshold: 0.01}))

	t.end()
})

t('readme cases', async t => {
	var fix = [0,0,0,255,255,255,255,255,255,255,255,255,0,0,0,255]

	if (isBrowser) {
		var out = document.createElement('canvas')
	}
	else {
		var out = 'a.png'
	}
	output(fix, [2,2], out)

	t.ok(eq(await load(out), fix))
	t.ok(eq(await load(out), fix, {threshold: .2}))

	if (!isBrowser)	await del('a.png')

	t.end()
})



t('diff to console', t => {
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], true))

	t.end()
})
t('diff to canvas, context, imagedata', t => {
	if (!isBrowser) return t.end()
	var canvas = document.createElement('canvas')
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], canvas))
	var arr = []
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], arr))
	t.ok(eq(arr, canvas))

	var idata = canvas.getContext('2d').createImageData(2,1)
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], idata))
	t.ok(eq(arr, idata))

	t.end()
})
t('diff to filename string', async t => {
	if (isBrowser) return t.end()
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], './a.png'))
	t.ok(eq(await load('./a.png'), [255,0,0,255, 255,255,255,255]))

	await del('./a.png')
	t.end()
})
t('diff to floatarray, uintarray, object', t => {
	var arr = []
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], arr))

	var farr = new Float32Array(8)
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], farr))

	var uarr = new Uint8Array(8)
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], uarr))

	var obj = {}
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], obj))

	t.ok(eq(arr, farr))
	t.ok(eq(farr, uarr))
	t.ok(eq(uarr, obj))

	t.end()
})
t('diff to function', t => {
	var obj = {}
	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], obj))

	t.notOk(eq([0,0,0,255, 255,255,255,255], [0,0,0,0, 255,255,255,255], function (diff) {
		t.deepEqual(diff.data, obj.data)
		t.ok(eq(diff, obj))
		t.end()
	}))
})

t('clip', async t => {
	let x = [0,0,0,0, 0,0,0,255, 0,0,0,255, 0,0,0,0]
	let x2 = [0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255]


	t.notOk(eq(x, x2))
	t.ok(eq(x, x2, {clip: [1,0,2,2]}))

	t.end()
})
