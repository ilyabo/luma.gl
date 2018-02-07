'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GL_PARAMETER_GETTERS = exports.GL_PARAMETER_SETTERS = exports.GL_PARAMETER_DEFAULTS = undefined;

var _GL_PARAMETER_DEFAULT, _GL_PARAMETER_SETTERS, _GL_PARAMETER_GETTERS;

exports.setParameter = setParameter;
exports.setParameters = setParameters;
exports.getParameter = getParameter;
exports.getParameters = getParameters;
exports.getDefaultParameters = getDefaultParameters;
exports.resetParameters = resetParameters;
exports.getModifiedParameters = getModifiedParameters;

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // Provides a unified API for getting and setting any WebGL parameter
// Also knows default values of all parameters, enabling fast cache initialization
// Provides base functionality for the state caching.


// DEFAULT SETTINGS - FOR FAST CACHE INITIALIZATION AND CONTEXT RESETS

var GL_PARAMETER_DEFAULTS = exports.GL_PARAMETER_DEFAULTS = (_GL_PARAMETER_DEFAULT = {}, _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_COLOR, new Float32Array([0, 0, 0, 0])), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_EQUATION_RGB, _constants2.default.FUNC_ADD), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_EQUATION_ALPHA, _constants2.default.FUNC_ADD), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_SRC_RGB, _constants2.default.ONE), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_DST_RGB, _constants2.default.ZERO), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_SRC_ALPHA, _constants2.default.ONE), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.BLEND_DST_ALPHA, _constants2.default.ZERO), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.COLOR_CLEAR_VALUE, new Float32Array([0, 0, 0, 0])), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.COLOR_WRITEMASK, [true, true, true, true]), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.CULL_FACE, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.CULL_FACE_MODE, _constants2.default.BACK), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.DEPTH_TEST, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.DEPTH_CLEAR_VALUE, 1), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.DEPTH_FUNC, _constants2.default.LESS), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.DEPTH_RANGE, new Float32Array([0, 1])), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.DEPTH_WRITEMASK, true), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.DITHER, true), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.FRAMEBUFFER_BINDING, null), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.FRONT_FACE, _constants2.default.CCW), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.GENERATE_MIPMAP_HINT, _constants2.default.DONT_CARE), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.LINE_WIDTH, 1), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.POLYGON_OFFSET_FILL, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.POLYGON_OFFSET_FACTOR, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.POLYGON_OFFSET_UNITS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.SAMPLE_COVERAGE_VALUE, 1.0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.SAMPLE_COVERAGE_INVERT, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.SCISSOR_TEST, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.SCISSOR_BOX, new Int32Array([0, 0, 1024, 1024])), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_TEST, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_CLEAR_VALUE, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_WRITEMASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_WRITEMASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_FUNC, _constants2.default.ALWAYS), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_REF, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_VALUE_MASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_FUNC, _constants2.default.ALWAYS), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_REF, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_VALUE_MASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_FAIL, _constants2.default.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_PASS_DEPTH_FAIL, _constants2.default.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_PASS_DEPTH_PASS, _constants2.default.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_FAIL, _constants2.default.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_PASS_DEPTH_FAIL, _constants2.default.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.STENCIL_BACK_PASS_DEPTH_PASS, _constants2.default.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.VIEWPORT, new Int32Array([0, 0, 1024, 1024])), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.PACK_ALIGNMENT, 4), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_ALIGNMENT, 4), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_FLIP_Y_WEBGL, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_COLORSPACE_CONVERSION_WEBGL, _constants2.default.BROWSER_DEFAULT_WEBGL), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.FRAGMENT_SHADER_DERIVATIVE_HINT, _constants2.default.DONT_CARE), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.READ_FRAMEBUFFER_BINDING, null), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.RASTERIZER_DISCARD, false), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.PACK_ROW_LENGTH, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.PACK_SKIP_PIXELS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.PACK_SKIP_ROWS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_ROW_LENGTH, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_IMAGE_HEIGHT, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_SKIP_PIXELS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_SKIP_ROWS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, _constants2.default.UNPACK_SKIP_IMAGES, 0), _GL_PARAMETER_DEFAULT);

// SETTER TABLES - ENABLES SETTING ANY PARAMETER WITH A COMMON API

var enable = function enable(gl, value, key) {
  return value ? gl.enable(key) : gl.disable(key);
};
var hint = function hint(gl, value, key) {
  return gl.hint(key, value);
};
var pixelStorei = function pixelStorei(gl, value, key) {
  return gl.pixelStorei(key, value);
};

var drawFramebuffer = function drawFramebuffer(gl, value) {
  return gl.bindFramebuffer(_constants2.default.DRAW_FRAMEBUFFER, value);
};
var readFramebuffer = function readFramebuffer(gl, value) {
  return gl.bindFramebuffer(_constants2.default.READ_FRAMEBUFFER, value);
};

// Map from WebGL parameter names to corresponding WebGL setter functions
// WegGL constants are read by parameter names, but set by function names
// NOTE: When value type is a string, it will be handled by 'COMPOSITE_GL_PARAMETER_SETTERS'
var GL_PARAMETER_SETTERS = exports.GL_PARAMETER_SETTERS = (_GL_PARAMETER_SETTERS = {}, _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_COLOR, function (gl, value) {
  return gl.blendColor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_EQUATION_RGB, 'blendEquation'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_EQUATION_ALPHA, 'blendEquation'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_SRC_RGB, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_DST_RGB, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_SRC_ALPHA, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.BLEND_DST_ALPHA, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.COLOR_CLEAR_VALUE, function (gl, value) {
  return gl.clearColor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.COLOR_WRITEMASK, function (gl, value) {
  return gl.colorMask.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.CULL_FACE, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.CULL_FACE_MODE, function (gl, value) {
  return gl.cullFace(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.DEPTH_TEST, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.DEPTH_CLEAR_VALUE, function (gl, value) {
  return gl.clearDepth(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.DEPTH_FUNC, function (gl, value) {
  return gl.depthFunc(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.DEPTH_RANGE, function (gl, value) {
  return gl.depthRange.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.DEPTH_WRITEMASK, function (gl, value) {
  return gl.depthMask(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.DITHER, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.FRAGMENT_SHADER_DERIVATIVE_HINT, hint), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.FRAMEBUFFER_BINDING, drawFramebuffer), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.FRONT_FACE, function (gl, value) {
  return gl.frontFace(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.GENERATE_MIPMAP_HINT, hint), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.LINE_WIDTH, function (gl, value) {
  return gl.lineWidth(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.POLYGON_OFFSET_FILL, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.POLYGON_OFFSET_FACTOR, 'polygonOffset'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.POLYGON_OFFSET_UNITS, 'polygonOffset'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.RASTERIZER_DISCARD, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.SAMPLE_COVERAGE_VALUE, 'sampleCoverage'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.SAMPLE_COVERAGE_INVERT, 'sampleCoverage'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.SCISSOR_TEST, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.SCISSOR_BOX, function (gl, value) {
  return gl.scissor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_TEST, enable), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_CLEAR_VALUE, function (gl, value) {
  return gl.clearStencil(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_WRITEMASK, function (gl, value) {
  return gl.stencilMaskSeparate(_constants2.default.FRONT, value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_WRITEMASK, function (gl, value) {
  return gl.stencilMaskSeparate(_constants2.default.BACK, value);
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_FUNC, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_REF, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_VALUE_MASK, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_FUNC, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_REF, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_VALUE_MASK, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_FAIL, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_PASS_DEPTH_FAIL, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_PASS_DEPTH_PASS, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_FAIL, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_PASS_DEPTH_FAIL, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.STENCIL_BACK_PASS_DEPTH_PASS, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.VIEWPORT, function (gl, value) {
  return gl.viewport.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.PACK_ALIGNMENT, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_ALIGNMENT, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_FLIP_Y_WEBGL, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_COLORSPACE_CONVERSION_WEBGL, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.PACK_ROW_LENGTH, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.PACK_SKIP_PIXELS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.PACK_SKIP_ROWS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.READ_FRAMEBUFFER_BINDING, readFramebuffer), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_ROW_LENGTH, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_IMAGE_HEIGHT, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_SKIP_PIXELS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_SKIP_ROWS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, _constants2.default.UNPACK_SKIP_IMAGES, pixelStorei), _GL_PARAMETER_SETTERS);

// COMPOSITE_WEBGL_PARAMETER_
var COMPOSITE_GL_PARAMETER_SETTERS = {
  blendEquation: function blendEquation(gl, values) {
    return gl.blendEquationSeparate(values[_constants2.default.BLEND_EQUATION_RGB], values[_constants2.default.BLEND_EQUATION_ALPHA]);
  },
  blendFunc: function blendFunc(gl, values) {
    return gl.blendFuncSeparate(values[_constants2.default.BLEND_SRC_RGB], values[_constants2.default.BLEND_DST_RGB], values[_constants2.default.BLEND_SRC_ALPHA], values[_constants2.default.BLEND_DST_ALPHA]);
  },
  polygonOffset: function polygonOffset(gl, values) {
    return gl.polygonOffset(values[_constants2.default.POLYGON_OFFSET_FACTOR], values[_constants2.default.POLYGON_OFFSET_UNITS]);
  },
  sampleCoverage: function sampleCoverage(gl, values) {
    return gl.sampleCoverage(values[_constants2.default.SAMPLE_COVERAGE_VALUE], values[_constants2.default.SAMPLE_COVERAGE_INVERT]);
  },
  stencilFuncFront: function stencilFuncFront(gl, values) {
    return gl.stencilFuncSeparate(_constants2.default.FRONT, values[_constants2.default.STENCIL_FUNC], values[_constants2.default.STENCIL_REF], values[_constants2.default.STENCIL_VALUE_MASK]);
  },
  stencilFuncBack: function stencilFuncBack(gl, values) {
    return gl.stencilFuncSeparate(_constants2.default.BACK, values[_constants2.default.STENCIL_BACK_FUNC], values[_constants2.default.STENCIL_BACK_REF], values[_constants2.default.STENCIL_BACK_VALUE_MASK]);
  },
  stencilOpFront: function stencilOpFront(gl, values) {
    return gl.stencilOpSeparate(_constants2.default.FRONT, values[_constants2.default.STENCIL_FAIL], values[_constants2.default.STENCIL_PASS_DEPTH_FAIL], values[_constants2.default.STENCIL_PASS_DEPTH_PASS]);
  },
  stencilOpBack: function stencilOpBack(gl, values) {
    return gl.stencilOpSeparate(_constants2.default.BACK, values[_constants2.default.STENCIL_BACK_FAIL], values[_constants2.default.STENCIL_BACK_PASS_DEPTH_FAIL], values[_constants2.default.STENCIL_BACK_PASS_DEPTH_PASS]);
  }
};

// GETTER TABLE - FOR READING OUT AN ENTIRE CONTEXT

var isEnabled = function isEnabled(gl, key) {
  return gl.isEnabled(key);
};

// Exceptions for any keys that cannot be queried by gl.getParameters
var GL_PARAMETER_GETTERS = exports.GL_PARAMETER_GETTERS = (_GL_PARAMETER_GETTERS = {}, _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.BLEND, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.CULL_FACE, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.DEPTH_TEST, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.DITHER, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.POLYGON_OFFSET_FILL, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.SAMPLE_ALPHA_TO_COVERAGE, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.SAMPLE_COVERAGE, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.SCISSOR_TEST, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.STENCIL_TEST, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, _constants2.default.RASTERIZER_DISCARD, isEnabled), _GL_PARAMETER_GETTERS);

// HELPER METHODS

var deepArrayEqual = function deepArrayEqual(x, y) {
  if (x === y) {
    return true;
  }
  var isArrayX = Array.isArray(x) || ArrayBuffer.isView(x);
  var isArrayY = Array.isArray(y) || ArrayBuffer.isView(y);
  if (isArrayX && isArrayY && x.length === y.length) {
    for (var i = 0; i < x.length; ++i) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
};

// PUBLIC METHODS

// Sets any single GL parameter regardless of function (gl.getParameter/gl.isEnabled...)
// Returns the previous value
// Note: limited to parameter values
function setParameter(gl, key, value) {
  var getter = GL_PARAMETER_GETTERS[key];
  var prevValue = getter ? getter(gl, Number(key)) : gl.getParameter(Number(key));
  var setter = GL_PARAMETER_SETTERS[key];
  (0, _assert2.default)(typeof setter === 'function');
  setter(gl, value, Number(key));
  return prevValue;
}

// Sets any GL parameter regardless of function (gl.blendMode, ...)
// Note: requires a `cache` object to be set on the context (gl.state.cache)
// This object is used to fill in any missing values for composite setter functions
function setParameters(gl, values) {
  var compositeSetters = {};

  // HANDLE PRIMITIVE SETTERS (and make note of any composite setters)

  for (var key in values) {
    var setter = GL_PARAMETER_SETTERS[key];
    if (setter) {
      // Composite setters should only be called once, so save them
      if (typeof setter === 'string') {
        compositeSetters[setter] = true;
        // only call setter if value has changed
        // TODO - deep equal on values?
      } else {
        // Note - the setter will automatically update this.state
        setter(gl, values[key], Number(key));
      }
    }
  }

  // HANDLE COMPOSITE SETTERS

  // NOTE: any non-provided values needed by composite setters are filled in from state cache
  // The cache parameter is automatically retrieved from the context
  // This depends on `trackContextState`, which is technically a "circular" dependency.
  // But it is too inconvenient to always require a cache parameter here.
  // This is the ONLY external dependency in this module/
  var cache = gl.state && gl.state.cache;
  if (cache) {
    var mergedValues = Object.assign({}, cache, values);

    for (var _key in compositeSetters) {
      // TODO - avoid calling composite setters if values have not changed.
      var compositeSetter = COMPOSITE_GL_PARAMETER_SETTERS[_key];
      // Note - if `trackContextState` has been called,
      // the setter will automatically update this.state.cache
      compositeSetter(gl, mergedValues);
    }
  }
  // Add a log for the else case?
}

// Queries any single GL parameter regardless of function (gl.getParameter/gl.isEnabled...)
function getParameter(gl, key) {
  var getter = GL_PARAMETER_GETTERS[key];
  return getter ? getter(gl, Number(key)) : gl.getParameter(Number(key));
}

// Copies the state from a context (gl.getParameter should not be overriden)
// Reads the entire WebGL state from a context
// Caveat: This generates a huge amount of synchronous driver roundtrips and should be
// considered a very slow operation, to be used only if/when a context already manipulated
// by external code needs to be synchronized for the first time
// @return {Object} - a newly created map, with values keyed by GL parameters
function getParameters(gl, parameters) {
  // default to querying all parameters
  parameters = parameters || GL_PARAMETER_DEFAULTS;
  // support both arrays of parameters and objects (keys represent parameters)
  var parameterKeys = Array.isArray(parameters) ? parameters : Object.keys(parameters);

  var state = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = parameterKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      state[key] = getParameter(gl, key);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return state;
}

function getDefaultParameters(gl) {
  // TODO - Query GL.VIEWPORT and GL.SCISSOR_BOX since these are dynamic
  return Object.assign({}, GL_PARAMETER_DEFAULTS, {
    // TODO: For viewport and scissor default values are set at the time of
    // context creation based on canvas size, we can query them here but it will
    // not match with what we have in GL_PARAMETER_DEFAULTS table, we should revisit.
    // [GL.VIEWPORT]: gl.constructor.prototype.getParameter.call(gl, GL.VIEWPORT),
    // [GL.SCISSOR_BOX]: gl.constructor.prototype.getParameter.call(gl, GL.SCISSOR_BOX)
  });
}

// Reset all parameters to a pure context state
function resetParameters(gl) {
  setParameters(gl, getDefaultParameters(gl));
}

// Get all parameters that have been modified from a pure context state
function getModifiedParameters(gl) {
  var values = getParameters(GL_PARAMETER_DEFAULTS);
  var modified = {};
  for (var key in GL_PARAMETER_DEFAULTS) {
    if (!deepArrayEqual(values[key], GL_PARAMETER_DEFAULTS[key])) {
      modified[key] = values[key];
    }
  }
  return modified;
}
//# sourceMappingURL=set-parameters.js.map