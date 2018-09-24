'use strict'

let eq = require('./')
let t = require('tape')

// let c = document.body.appendChild(document.createElement('canvas'))
// c.width = c.height = 2
// let c2d = c.getContext('2d')
// c2d.fillRect(1,0,1,1)
// c2d.fillRect(0,1,1,1)


t('bad urls throw error', t => {
	t.plan(1)

	eq('./1.png', './2.png')
	.catch(t.ok)
	.then(t.end)
})

t('pixels / url' , t => {
	t.plan(2)

	let x = [0,0,0,0, 0,0,0,1, 0,0,0,1, 0,0,0,0]

	eq('./x.png', x)
	.then(() => eq('./x.png', x), t.fail)
	.then(() => {
		x[3] = 1
		return eq('./x.png', x)
	}, t.fail)
	.catch(({count, data}) => {
		t.equal(count, 1)
		t.ok(data.length)
	})
	.then(t.end)
})

t('options', t => {
	t.end()
})
