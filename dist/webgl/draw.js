'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw = draw;

var _glConstants = require('./gl-constants');

var _glConstants2 = _interopRequireDefault(_glConstants);

var _context = require('./context');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A good thing about webGL is that there are so many ways to draw things,
// e.g. depending on whether data is indexed and/or isInstanced.
// This function unifies those into a single call with simple parameters
// that have sane defaults.
function draw(gl, _ref) {
  var _ref$drawMode = _ref.drawMode,
      drawMode = _ref$drawMode === undefined ? _glConstants2.default.TRIANGLES : _ref$drawMode,
      vertexCount = _ref.vertexCount,
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? 0 : _ref$offset,
      _ref$isIndexed = _ref.isIndexed,
      isIndexed = _ref$isIndexed === undefined ? false : _ref$isIndexed,
      _ref$indexType = _ref.indexType,
      indexType = _ref$indexType === undefined ? _glConstants2.default.UNSIGNED_SHORT : _ref$indexType,
      _ref$isInstanced = _ref.isInstanced,
      isInstanced = _ref$isInstanced === undefined ? false : _ref$isInstanced,
      _ref$instanceCount = _ref.instanceCount,
      instanceCount = _ref$instanceCount === undefined ? 0 : _ref$instanceCount;

  (0, _context.assertWebGLContext)(gl);

  var extension = gl.getExtension('ANGLE_instanced_arrays');

  // TODO - Use polyfilled WebGL2RenderingContext instead of ANGLE extension
  if (isInstanced) {
    var webgl2 = isWebGL2(gl);
    var _extension = gl.getExtension('ANGLE_instanced_arrays');
    var context = webgl2 ? gl : _extension;
    var suffix = webgl2 ? '' : 'ANGLE';
    var drawElements = 'drawElementsInstanced' + suffix;
    var drawArrays = 'drawArraysInstanced' + suffix;

    if (isIndexed) {
      context[drawElements](drawMode, vertexCount, indexType, offset, instanceCount);
    } else {
      context[drawArrays](drawMode, offset, vertexCount, instanceCount);
    }
  } else if (isIndexed) {
    gl.drawElements(drawMode, vertexCount, indexType, offset);
  } else {
    gl.drawArrays(drawMode, offset, vertexCount);
  }
} /* eslint-disable */
// TODO - generic draw call
// One of the good things about GL is that there are so many ways to draw things
//# sourceMappingURL=draw.js.map