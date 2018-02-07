'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.clear = clear;
exports.clearBuffer = clearBuffer;

var _context = require('./context');

var _contextState = require('./context-state');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Should collapse during minification
var GL_DEPTH_BUFFER_BIT = 0x00000100;
var GL_STENCIL_BUFFER_BIT = 0x00000400;
var GL_COLOR_BUFFER_BIT = 0x00004000;

var GL_COLOR = 0x1800;
var GL_DEPTH = 0x1801;
var GL_STENCIL = 0x1802;
var GL_DEPTH_STENCIL = 0x84F9;

// Should disappear if asserts are removed
var ERR_ARGUMENTS = 'clear: bad arguments';

// Optionally clears depth, color and stencil buffers
function clear(gl) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$framebuffer = _ref.framebuffer,
      framebuffer = _ref$framebuffer === undefined ? null : _ref$framebuffer,
      _ref$color = _ref.color,
      color = _ref$color === undefined ? null : _ref$color,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? null : _ref$depth,
      _ref$stencil = _ref.stencil,
      stencil = _ref$stencil === undefined ? null : _ref$stencil;

  var parameters = {};

  if (framebuffer) {
    parameters.framebuffer = framebuffer;
  }

  var clearFlags = 0;

  if (color) {
    clearFlags |= GL_COLOR_BUFFER_BIT;
    if (color !== true) {
      parameters.clearColor = color;
    }
  }

  if (depth) {
    clearFlags |= GL_DEPTH_BUFFER_BIT;
    if (depth !== true) {
      parameters.clearDepth = depth;
    }
  }

  if (stencil) {
    clearFlags |= GL_STENCIL_BUFFER_BIT;
    if (depth !== true) {
      parameters.clearStencil = depth;
    }
  }

  (0, _assert2.default)(clearFlags !== 0, ERR_ARGUMENTS);

  // Temporarily set any clear "colors" and call clear
  (0, _contextState.withParameters)(gl, parameters, function () {
    gl.clear(clearFlags);
  });
}

// WebGL2 - clear a specific drawing buffer
function clearBuffer(gl) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$framebuffer = _ref2.framebuffer,
      framebuffer = _ref2$framebuffer === undefined ? null : _ref2$framebuffer,
      _ref2$buffer = _ref2.buffer,
      buffer = _ref2$buffer === undefined ? GL_COLOR : _ref2$buffer,
      _ref2$drawBuffer = _ref2.drawBuffer,
      drawBuffer = _ref2$drawBuffer === undefined ? 0 : _ref2$drawBuffer,
      _ref2$value = _ref2.value,
      value = _ref2$value === undefined ? [0, 0, 0, 0] : _ref2$value;

  (0, _assert2.default)((0, _context.isWebGL2)(gl), _context.ERR_WEBGL2);

  (0, _contextState.withParameters)(gl, { framebuffer: framebuffer }, function () {

    // Method selection per OpenGL ES 3 docs
    switch (buffer) {
      case GL_COLOR:
        switch (value.constructor) {
          case Int32Array:
            gl.clearBufferiv(buffer, drawBuffer, value);
            break;
          case Uint32Array:
            gl.clearBufferuiv(buffer, drawBuffer, value);
            break;
          case Float32Array:
          default:
            gl.clearBufferfv(buffer, drawBuffer, value);
        }
        break;

      case GL_DEPTH:
        gl.clearBufferfv(GL_DEPTH, 0, [value]);
        break;

      case GL_STENCIL:
        gl.clearBufferiv(GL_STENCIL, 0, [value]);
        break;

      case GL_DEPTH_STENCIL:
        var _value = _slicedToArray(value, 2),
            depth = _value[0],
            stencil = _value[1];

        gl.clearBufferfi(GL_DEPTH_STENCIL, 0, depth, stencil);
        break;

      default:
        (0, _assert2.default)(false, ERR_ARGUMENTS);
    }
  });
}
//# sourceMappingURL=clear.js.map