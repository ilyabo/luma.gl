'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPageLoadPromise = getPageLoadPromise;
exports.createCanvas = createCanvas;
exports.getCanvas = getCanvas;
exports.getCSSSize = getCSSSize;
exports.getDrawingBufferSize = getDrawingBufferSize;
exports.calculateDrawingBufferSize = calculateDrawingBufferSize;
exports.resizeCanvas = resizeCanvas;
exports.resizeDrawingBuffer = resizeDrawingBuffer;

var _utils = require('../utils');

var isBrowser = typeof window !== 'undefined'; // Resizing a webgl canvas

/* global window, document */


var isPageLoaded = isBrowser && document.readyState === 'complete';

var pageLoadPromise = isBrowser ? new Promise(function (resolve, reject) {
  if (isPageLoaded) {
    resolve(document);
    return;
  }
  window.onload = function () {
    isPageLoaded = true;
    resolve(document);
  };
}) : Promise.resolve({});

/**
 * Returns a promise that resolves when the page is loaded
 * at this point the DOM can be manipulated, and e.g. a new canvas can be inserted
 * @return {Promise} - resolves when the page is loaded
 */
function getPageLoadPromise() {
  return pageLoadPromise;
}

/**
 * Create a canvas
 * @param {Number} width - set to 100%
 * @param {Number} height - set to 100%
 */
function createCanvas(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === undefined ? 800 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 600 : _ref$height,
      _ref$id = _ref.id,
      id = _ref$id === undefined ? 'gl-canvas' : _ref$id,
      _ref$insert = _ref.insert,
      insert = _ref$insert === undefined ? true : _ref$insert;

  var canvas = document.createElement('canvas');
  canvas.id = id;
  canvas.style.width = Number.isFinite(width) ? width + 'px' : '100%';
  canvas.style.height = Number.isFinite(height) ? height + 'px' : '100%';
  // add the canvas to the body element once the page has loaded
  if (insert) {
    getPageLoadPromise().then(function (document) {
      var body = document.body;
      body.insertBefore(canvas, body.firstChild);
    });
  }
  return canvas;
}

/**
 * Gets an already created canvas from the DOM
 * @param {Number} id - DOM element id
 */
function getCanvas(_ref2) {
  var id = _ref2.id;

  if (!isPageLoaded) {
    throw new Error('createGLContext called on canvas \'' + id + '\' before page was loaded');
  }
  return document.getElementById(id);
}

// Gets current size of canvas in css (logical/window) coordinates
function getCSSSize(canvas) {
  return {
    width: canvas.clientWidth,
    height: canvas.clientHeight
  };
}

// Gets current size of canvas drawing buffer in actual pixels
// This is needed for the gl.viewport call
function getDrawingBufferSize(canvas) {
  return {
    width: canvas.width,
    height: canvas.height
  };
}

// Calculate the drawing buffer size that would cover current canvas size and device pixel ratio
// Intention is that every pixel in the drawing buffer will have a 1-to-1 mapping with
// actual device pixels in the hardware framebuffer, allowing us to render at the full
// resolution of the device.
function calculateDrawingBufferSize(canvas, _ref3) {
  var _ref3$useDevicePixelR = _ref3.useDevicePixelRatio,
      useDevicePixelRatio = _ref3$useDevicePixelR === undefined ? null : _ref3$useDevicePixelR,
      _ref3$useDevicePixels = _ref3.useDevicePixels,
      useDevicePixels = _ref3$useDevicePixels === undefined ? true : _ref3$useDevicePixels;

  if (useDevicePixelRatio !== null) {
    _utils.log.deprecated('useDevicePixelRatio', 'useDevicePixels');
    useDevicePixels = useDevicePixelRatio;
  }
  var cssToDevicePixels = useDevicePixels ? window.devicePixelRatio || 1 : 1;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var cssSize = getCSSSize(canvas);
  return {
    width: Math.floor(cssSize.width * cssToDevicePixels),
    height: Math.floor(cssSize.height * cssToDevicePixels),
    devicePixelRatio: cssToDevicePixels
  };
}

/**
 * Resizes canvas in "CSS coordinates" (note these can be very different from device coords,
 * depending on devicePixelRatio/retina screens and size of drawing buffer)
 * and can be changed separately from drawing buffer size.
 * Therefore, normally `resizeDrawingBuffer` should be called after calling `resizeCanvas`.
 *
 * See http://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
 *
 * @param {Number} width, height - new width and height of canvas in CSS coordinates
 */
function resizeCanvas(canvas, _ref4) {
  var width = _ref4.width,
      height = _ref4.height;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

/**
 * Resize the canvas' drawing buffer to match the canvas CSS size,
 * and by default to also consider devicePixelRatio
 * detects if anything has changed, can be called every frame
 * for best visual results, usually set to either:
 *  canvas CSS width x canvas CSS height
 *  canvas CSS width * devicePixelRatio x canvas CSS height * devicePixelRatio
 *
 * NOTE: Regardless of size, the drawing buffer will always be scaled to the viewport
 * See http://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
 *
 * @param {Number} width - new width of canvas in CSS coordinates
 * @param {Number} height - new height of canvas in CSS coordinates
 */
function resizeDrawingBuffer(canvas, _ref5) {
  var _ref5$useDevicePixelR = _ref5.useDevicePixelRatio,
      useDevicePixelRatio = _ref5$useDevicePixelR === undefined ? null : _ref5$useDevicePixelR,
      _ref5$useDevicePixels = _ref5.useDevicePixels,
      useDevicePixels = _ref5$useDevicePixels === undefined ? true : _ref5$useDevicePixels;

  // Resize the render buffer of the canvas to match canvas client size
  if (useDevicePixelRatio !== null) {
    _utils.log.deprecated('useDevicePixelRatio', 'useDevicePixels');
    useDevicePixels = useDevicePixelRatio;
  }
  // multiplying with dpr (Optionally can be turned off)
  var newBufferSize = calculateDrawingBufferSize(canvas, { useDevicePixels: useDevicePixels });
  // Only update if the canvas size has not changed
  if (newBufferSize.width !== canvas.width || newBufferSize.height !== canvas.height) {
    // Make the canvas render buffer the same size as
    canvas.width = newBufferSize.width;
    canvas.height = newBufferSize.height;
    // Always reset CSS size after setting drawing buffer size
    // canvas.style.width = `${cssSize.width}px`;
    // canvas.style.height = `${cssSize.height}px`;
  }
}
//# sourceMappingURL=create-canvas.js.map