'use strict'

// compare two images: canvas, url, image data or array
var getPixels = require('image-pixels')
var pxmatch = require('pixelmatch')
var pick = require('pick-by-alias')
var isObj = require('is-plain-obj')

var isDoc = typeof document !== 'undefined'

module.exports = imgEqual

var ctx
if (isDoc) {
  ctx = document.createElement('canvas').getContext('2d')
}

var cache = {}

function imgEqual(a, b, dst, o) {
  if (!a || !b) throw Error('Bad arguments')

  if (isObj(dst) && !o) {
    o = dst
  }

  o = pick(o || {}, {
    clip: 'clip rect slice rectangle area',
    includeAA: 'includeAA aa antialias AA',
    threshold: 'threshold tol tolerance tshd level'
  }, true)

  if (!o.threshold) o.threshold = 0
  if (o.includeAA == null) o.includeAA = false

  return getPixels.all([a, b], o).then(function(ab) {
    var a = ab[0], b = ab[1]
    var diff = a.slice()
    var count = pxmatch(a, b, diff, a.width, a.height, o)

    if (count) {
      if (dst) {
        dst.count = count

        if (dst.getContext) {
          var ctx = dst.getContext('2d')
          ctx.canvas.width = a.width
          ctx.canvas.height = a.height
          var idata = ctx.createImageData(a.width, a.height)
          idata.data.set(diff)
          ctx.putImageData(idata, 0, 0)
        }

        if (dst.length != null) {
          for (let i = 0; i < diff.length; i++) {
            dst[i] = diff[i]
          }
        }
        else {
          dst.data = diff
        }
      }

      return false
    }

    return true
  })
}
