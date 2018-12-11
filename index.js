// compare two images: canvas, url, image data or array
'use strict'

var pxls = require('pxls')
var output = require('image-output')
var pxmatch = require('pixelmatch')
var pick = require('pick-by-alias')
var isObj = require('is-plain-obj')
var clip = require('clip-pixels')
var rect = require('parse-rect')
var isBrowser = require('is-browser')
var x = require('object-assign')

module.exports = equal

var context

function equal(a, b, dst, o) {
  if (!a || !b) throw Error('Bad arguments')

  if (!o) {
    // if only options passed
    if (isObj(dst) || typeof dst === 'number' || Array.isArray(dst)) {
      o = dst

      // avoid exposing on number
      if (typeof dst === 'number') dst = null
    }
  }

  if (typeof o === 'number') o = {threshold: o}
  else if (Array.isArray(o)) o = {shape: o}
  o = pick(o || {}, {
    clip: 'clip rect slice rectangle area',
    includeAA: 'includeAA aa antialias AA',
    threshold: 'threshold tol tolerance tshd level'
  }, true)

  if (o.threshold == null) o.threshold = 0.1
  if (o.includeAA == null) o.includeAA = false

  // figure out width/height
  if (o.shape) o.width = o.shape[0], o.height = o.shape[1]
  if (!o.width) o.width = a.shape ? a.shape[0] : a.width || a.drawingBufferWidth
  if (!o.width) o.width = b.shape ? b.shape[0] : b.width || b.drawingBufferWidth
  if (!o.height) o.height = a.shape ? a.shape[1] : a.height || a.drawingBufferHeight
  if (!o.height) o.height = b.shape ? b.shape[1] : b.height || b.drawingBufferHeight

  var pixelsA = pxls(a)
  var pixelsB = pxls(b)
  if (!o.width) o.width = pixelsA.length >> 2
  if (!o.height) o.height = (pixelsA.length >> 2) / o.width

  // apply clipping, if passed
  if (o.clip) {
    if (!o.width || !o.height) throw Error('Cannot apply clip to data without dimensions info')
    o.clip = rect(o.clip)
    pixelsA = clip(pixelsA, [o.width, o.height, 4], [o.clip.x, o.clip.y, o.clip.width, o.clip.height])
    pixelsB = clip(pixelsB, [o.width, o.height, 4], [o.clip.x, o.clip.y, o.clip.width, o.clip.height])
    o.width = o.clip.width
    o.height = o.clip.height
  }

  // do comparison
  var diffData = pixelsA.slice()
  var count = pxmatch(pixelsA, pixelsB, diffData, o.width, o.height, o)

  if (count) {
    // collect diff stats
    var ids = []
    var tol = o.threshold * 255
    var total = 0
    for (var i = 0; i < pixelsA.length; i+=4) {
      var pxDiff = Math.abs(pixelsA[i + 0] - pixelsB[i + 0]) +
          Math.abs(pixelsA[i + 1] - pixelsB[i + 1]) +
          Math.abs(pixelsA[i + 2] - pixelsB[i + 2]) +
          Math.abs(pixelsA[i + 3] - pixelsB[i + 3])
      if (pxDiff > tol) {
        ids.push(i)
        total += pxDiff
      }
    }

    // create diff stats imagedata
    var diffIdata
    if (isBrowser) {
      if (!context) context = document.createElement('canvas').getContext('2d')
      diffIdata = context.createImageData(o.width, o.height)
      diffIdata.data.set(diffData)
    }
    else {
      diffIdata = {data: diffData, width: o.width, height: o.height}
    }
    var diffStats = {
      count: count,
      ids: ids,
      amount: total / (255 * o.width * o.height * 4)
    }

    if (dst === true) dst = console

    if (dst) {
      if (typeof dst === 'function') {
        dst(x(diffIdata, diffStats))
      }
      else {
        output(diffIdata, dst)
        // transfer diff stats to destination as well
        if (dst.data || Array.isArray(dst) || ArrayBuffer.isView(dst) || isObj(dst)) {
          x(dst, diffStats)
        }
        // or print to console
        else if (dst === console) {
          console.log('Difference:', diffStats)
        }
      }
    }

    return false
  }

  return true
}
