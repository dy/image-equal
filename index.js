'use strict'

// compare two images: canvas, url, image data or array
var getPixels = require('get-pixels')
var pxmatch = require('pixelmatch')
var pick = require('pick-by-alias')
var flip = require('flip-pixels')

var isDoc = typeof document !== 'undefined'

module.exports = imgEqual

var ctx
if (isDoc) {
  ctx = document.createElement('canvas').getContext('2d')
}

var cache = {}

function imgEqual(a, b, o) {
  if (!a || !b) throw Error('Bad arguments')

  o = pick(o || {}, {
    includeAA: 'includeAA aa antialias AA',
    threshold: 'threshold tol tolerance tshd level'
  }, true)

  return new Promise(function (ok, nok) {
    Promise.all([loadPixels(a), loadPixels(b)]).then(function(ab) {
      var a = ab[0], b = ab[1]
      var diff = a.slice()
      var count = pxmatch(a, b, diff, a.width, a.height, o)

      if (count) {
        var errData = {
          count: count,
          data: diff,
          canvas: null
        }

        if (ctx) {
          ctx.canvas.width = a.width
          ctx.canvas.height = a.height
          var idata = ctx.createImageData(a.width, a.height)
          idata.data.set(diff)
          ctx.putImageData(idata, 0, 0)
          errData.canvas = ctx.canvas
        }

        nok(errData)
      }

      else {
        ok()
      }
    }, nok)
  })
}

function loadPixels(src) {
  return new Promise(function (ok, nok) {
    // bad arg
    if (!src) return nok('Bad argument ' + src)

    // fetch cached
    if (cache[src]) {
      return ok(cache[src])
    }

    // obj.canvas
    if (src.canvas) {
      src = src.canvas
    }
    if (src.context) {
      src = src.context
    }
    if (src.gl) {
      src = src.gl
    }
    if (src.getContext) {
      src = src.getContext('2d') || src.getContext('webgl')
    }

    // webgl context
    if (src.readPixels) {
      if (isDoc) {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        canvas.width = src.drawingBufferWidth
        canvas.height = src.drawingBufferHeight
        ctx.drawImage(src.canvas, 0, 0, src.drawingBufferWidth, src.drawingBufferHeight)
        src = ctx
      }

      // flipping pixels way of reading data (slow)
      else {
        pixels = new Uint8Array(src.drawingBufferWidth * src.drawingBufferHeight * 4)
        src.readPixels(0, 0, src.drawingBufferWidth, src.drawingBufferHeight, src.RGBA, src.UNSIGNED_BYTE, pixels)

        pixels.width = src.drawingBufferWidth
        pixels.height = src.drawingBufferHeight
        flip(pixels, pixels.width, pixels.height)
      }
    }

    // 2d context
    var pixels
    if (src.getImageData) {
      pixels = src.getImageData(0, 0, src.canvas.width, src.canvas.height).data
      pixels.width = src.canvas.width
      pixels.height = src.canvas.height
    }

    // float array, typedarray
    var i
    if (Array.isArray(src) || src instanceof Float32Array || src instanceof Float64Array) {
      pixels = new Uint8Array(src.length)
      for (i = 0; i < src.length; i++ ) {
        pixels[i] = src[i] * 255
      }
    }
    // any pixel-array-like
    if (typeof src !== 'string' && src.length) {
      pixels = new Uint8Array(src.length)
      for (i = 0; i < src.length; i++ ) {
        pixels[i] = src[i] * 255
      }
    }

    if (pixels) return ok(pixels)


    // url etc
    getPixels(src, function (err, px) {
      if (err) nok('Cannot get data from `' + typeof src + '`')

      else {
        px.data.width = px.shape[0]
        px.data.height = px.shape[1]

        // cache result
        cache[src] = px.data

        ok(px.data)
      }
    })
  })
}
