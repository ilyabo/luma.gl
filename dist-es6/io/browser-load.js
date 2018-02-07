'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPathPrefix = setPathPrefix;
exports.loadFile = loadFile;
exports.loadImage = loadImage;

var _browserRequestFile = require('./browser-request-file');

var pathPrefix = '';

/*
 * Set a relative path prefix
 */
function setPathPrefix(prefix) {
  pathPrefix = prefix;
}

function loadFile(url, opts) {
  if (typeof url !== 'string' && !opts) {
    // TODO - warn for deprecated mode
    opts = url;
    url = opts.url;
  }
  opts.url = pathPrefix ? pathPrefix + url : url;
  return (0, _browserRequestFile.requestFile)(opts);
}

/* global Image */

/*
 * Loads images asynchronously
 * image.crossOrigin can be set via opts.crossOrigin, default to 'anonymous'
 * returns a promise tracking the load
 */
function loadImage(url, opts) {
  url = pathPrefix ? pathPrefix + url : url;

  return new Promise(function (resolve, reject) {
    try {
      var image = new Image();
      image.onload = function () {
        return resolve(image);
      };
      image.onerror = function () {
        return reject(new Error('Could not load image ' + url + '.'));
      };
      image.crossOrigin = opts && opts.crossOrigin || 'anonymous';
      image.src = url;
    } catch (error) {
      reject(error);
    }
  });
}
//# sourceMappingURL=browser-load.js.map