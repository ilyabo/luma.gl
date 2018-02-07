'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fp64fs = exports.fp64arithmetic = exports.fp64ify = undefined;

var _fp64Utils = require('./fp64-utils');

Object.defineProperty(exports, 'fp64ify', {
  enumerable: true,
  get: function get() {
    return _fp64Utils.fp64ify;
  }
});

var _fp64Arithmetic = require('./fp64-arithmetic.glsl');

var _fp64Arithmetic2 = _interopRequireDefault(_fp64Arithmetic);

var _fp64Functions = require('./fp64-functions.glsl');

var _fp64Functions2 = _interopRequireDefault(_fp64Functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fp64shader = _fp64Arithmetic2.default + '\n' + _fp64Functions2.default;

exports.default = {
  name: 'fp64',
  vs: fp64shader,
  fs: null
};

// Arithmetic only

var fp64arithmetic = exports.fp64arithmetic = {
  name: 'fp64-arithmetic',
  vs: '' + _fp64Arithmetic2.default,
  fs: null
};

// Fragment shader fp64
var fp64fs = exports.fp64fs = {
  name: 'fp64-fs',
  vs: null,
  fs: fp64shader
};
//# sourceMappingURL=fp64.js.map