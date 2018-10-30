'use strict'

let eq = require('./')
let t = require('tape')

// let c = document.body.appendChild(document.createElement('canvas'))
// c.width = c.height = 2
// let c2d = c.getContext('2d')
// c2d.fillRect(1,0,1,1)
// c2d.fillRect(0,1,1,1)


t('bad urls throw error', async t => {
	t.plan(1)

	try {
		await eq('./1.png', './2.png')
	} catch (e) {
		t.ok(e)
	}

	t.end()
})

t('pixels / url' , async t => {
	t.plan(3)
	let x = [0,0,0,0, 0,0,0,255, 0,0,0,255, 0,0,0,0]

	t.ok(await eq('./x.png', {data: x, width: 2, height: 2}))

	t.ok(await eq('./x.png', {data: x, width: 2, height: 2}))

	x[3] = 255

	t.notOk(await eq('./x.png', {data: x, width: 2, height: 2}))

	t.end()
})

t('clip', async t => {
	t.plan(2)
	let x = [0,0,0,0, 0,0,0,255, 0,0,0,255, 0,0,0,0]
	x[3] = 255
	x.width = 2
	x.height = 2

	t.notOk(await eq('./x.png', x, {clip: [0,0,2,1]}))
	t.ok(await eq('./x.png', x, {clip: [0,1,2,1]}))

	t.end()
})

t('export diff', async t => {
	t.plan(3)

	let x = [0,0,0,0, 0,0,0,255, 0,0,0,255, 0,0,0,0]
	x[3] = 255

	var diff = {}
	await eq('./x.png', {data: x, width: 2, height: 2}, diff)

	t.equal(diff.count, 1)
	t.equal(diff.data.length, 16)

	diff = []
	await eq('./x.png', {data: x, width: 2, height: 2}, diff)

	t.equal(diff.length, 16)

	t.end()
})
