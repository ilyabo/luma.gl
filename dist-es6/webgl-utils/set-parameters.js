var _GL_PARAMETER_DEFAULT, _GL_PARAMETER_SETTERS, _GL_PARAMETER_GETTERS;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Provides a unified API for getting and setting any WebGL parameter
// Also knows default values of all parameters, enabling fast cache initialization
// Provides base functionality for the state caching.
import GL from './constants';
import assert from 'assert';

// DEFAULT SETTINGS - FOR FAST CACHE INITIALIZATION AND CONTEXT RESETS

export var GL_PARAMETER_DEFAULTS = (_GL_PARAMETER_DEFAULT = {}, _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_COLOR, new Float32Array([0, 0, 0, 0])), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_EQUATION_RGB, GL.FUNC_ADD), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_EQUATION_ALPHA, GL.FUNC_ADD), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_SRC_RGB, GL.ONE), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_DST_RGB, GL.ZERO), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_SRC_ALPHA, GL.ONE), _defineProperty(_GL_PARAMETER_DEFAULT, GL.BLEND_DST_ALPHA, GL.ZERO), _defineProperty(_GL_PARAMETER_DEFAULT, GL.COLOR_CLEAR_VALUE, new Float32Array([0, 0, 0, 0])), _defineProperty(_GL_PARAMETER_DEFAULT, GL.COLOR_WRITEMASK, [true, true, true, true]), _defineProperty(_GL_PARAMETER_DEFAULT, GL.CULL_FACE, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.CULL_FACE_MODE, GL.BACK), _defineProperty(_GL_PARAMETER_DEFAULT, GL.DEPTH_TEST, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.DEPTH_CLEAR_VALUE, 1), _defineProperty(_GL_PARAMETER_DEFAULT, GL.DEPTH_FUNC, GL.LESS), _defineProperty(_GL_PARAMETER_DEFAULT, GL.DEPTH_RANGE, new Float32Array([0, 1])), _defineProperty(_GL_PARAMETER_DEFAULT, GL.DEPTH_WRITEMASK, true), _defineProperty(_GL_PARAMETER_DEFAULT, GL.DITHER, true), _defineProperty(_GL_PARAMETER_DEFAULT, GL.FRAMEBUFFER_BINDING, null), _defineProperty(_GL_PARAMETER_DEFAULT, GL.FRONT_FACE, GL.CCW), _defineProperty(_GL_PARAMETER_DEFAULT, GL.GENERATE_MIPMAP_HINT, GL.DONT_CARE), _defineProperty(_GL_PARAMETER_DEFAULT, GL.LINE_WIDTH, 1), _defineProperty(_GL_PARAMETER_DEFAULT, GL.POLYGON_OFFSET_FILL, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.POLYGON_OFFSET_FACTOR, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.POLYGON_OFFSET_UNITS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.SAMPLE_COVERAGE_VALUE, 1.0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.SAMPLE_COVERAGE_INVERT, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.SCISSOR_TEST, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.SCISSOR_BOX, new Int32Array([0, 0, 1024, 1024])), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_TEST, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_CLEAR_VALUE, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_WRITEMASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_WRITEMASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_FUNC, GL.ALWAYS), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_REF, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_VALUE_MASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_FUNC, GL.ALWAYS), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_REF, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_VALUE_MASK, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_FAIL, GL.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_PASS_DEPTH_FAIL, GL.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_PASS_DEPTH_PASS, GL.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_FAIL, GL.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_PASS_DEPTH_FAIL, GL.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, GL.STENCIL_BACK_PASS_DEPTH_PASS, GL.KEEP), _defineProperty(_GL_PARAMETER_DEFAULT, GL.VIEWPORT, new Int32Array([0, 0, 1024, 1024])), _defineProperty(_GL_PARAMETER_DEFAULT, GL.PACK_ALIGNMENT, 4), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_ALIGNMENT, 4), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_FLIP_Y_WEBGL, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, GL.BROWSER_DEFAULT_WEBGL), _defineProperty(_GL_PARAMETER_DEFAULT, GL.FRAGMENT_SHADER_DERIVATIVE_HINT, GL.DONT_CARE), _defineProperty(_GL_PARAMETER_DEFAULT, GL.READ_FRAMEBUFFER_BINDING, null), _defineProperty(_GL_PARAMETER_DEFAULT, GL.RASTERIZER_DISCARD, false), _defineProperty(_GL_PARAMETER_DEFAULT, GL.PACK_ROW_LENGTH, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.PACK_SKIP_PIXELS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.PACK_SKIP_ROWS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_ROW_LENGTH, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_IMAGE_HEIGHT, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_SKIP_PIXELS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_SKIP_ROWS, 0), _defineProperty(_GL_PARAMETER_DEFAULT, GL.UNPACK_SKIP_IMAGES, 0), _GL_PARAMETER_DEFAULT);

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
  return gl.bindFramebuffer(GL.DRAW_FRAMEBUFFER, value);
};
var readFramebuffer = function readFramebuffer(gl, value) {
  return gl.bindFramebuffer(GL.READ_FRAMEBUFFER, value);
};

// Map from WebGL parameter names to corresponding WebGL setter functions
// WegGL constants are read by parameter names, but set by function names
// NOTE: When value type is a string, it will be handled by 'COMPOSITE_GL_PARAMETER_SETTERS'
export var GL_PARAMETER_SETTERS = (_GL_PARAMETER_SETTERS = {}, _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_COLOR, function (gl, value) {
  return gl.blendColor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_EQUATION_RGB, 'blendEquation'), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_EQUATION_ALPHA, 'blendEquation'), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_SRC_RGB, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_DST_RGB, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_SRC_ALPHA, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, GL.BLEND_DST_ALPHA, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, GL.COLOR_CLEAR_VALUE, function (gl, value) {
  return gl.clearColor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.COLOR_WRITEMASK, function (gl, value) {
  return gl.colorMask.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.CULL_FACE, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.CULL_FACE_MODE, function (gl, value) {
  return gl.cullFace(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.DEPTH_TEST, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.DEPTH_CLEAR_VALUE, function (gl, value) {
  return gl.clearDepth(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.DEPTH_FUNC, function (gl, value) {
  return gl.depthFunc(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.DEPTH_RANGE, function (gl, value) {
  return gl.depthRange.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.DEPTH_WRITEMASK, function (gl, value) {
  return gl.depthMask(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.DITHER, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.FRAGMENT_SHADER_DERIVATIVE_HINT, hint), _defineProperty(_GL_PARAMETER_SETTERS, GL.FRAMEBUFFER_BINDING, drawFramebuffer), _defineProperty(_GL_PARAMETER_SETTERS, GL.FRONT_FACE, function (gl, value) {
  return gl.frontFace(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.GENERATE_MIPMAP_HINT, hint), _defineProperty(_GL_PARAMETER_SETTERS, GL.LINE_WIDTH, function (gl, value) {
  return gl.lineWidth(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.POLYGON_OFFSET_FILL, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.POLYGON_OFFSET_FACTOR, 'polygonOffset'), _defineProperty(_GL_PARAMETER_SETTERS, GL.POLYGON_OFFSET_UNITS, 'polygonOffset'), _defineProperty(_GL_PARAMETER_SETTERS, GL.RASTERIZER_DISCARD, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.SAMPLE_COVERAGE_VALUE, 'sampleCoverage'), _defineProperty(_GL_PARAMETER_SETTERS, GL.SAMPLE_COVERAGE_INVERT, 'sampleCoverage'), _defineProperty(_GL_PARAMETER_SETTERS, GL.SCISSOR_TEST, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.SCISSOR_BOX, function (gl, value) {
  return gl.scissor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_TEST, enable), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_CLEAR_VALUE, function (gl, value) {
  return gl.clearStencil(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_WRITEMASK, function (gl, value) {
  return gl.stencilMaskSeparate(GL.FRONT, value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_WRITEMASK, function (gl, value) {
  return gl.stencilMaskSeparate(GL.BACK, value);
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_FUNC, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_REF, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_VALUE_MASK, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_FUNC, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_REF, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_VALUE_MASK, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_FAIL, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_PASS_DEPTH_FAIL, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_PASS_DEPTH_PASS, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_FAIL, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_PASS_DEPTH_FAIL, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, GL.STENCIL_BACK_PASS_DEPTH_PASS, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, GL.VIEWPORT, function (gl, value) {
  return gl.viewport.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, GL.PACK_ALIGNMENT, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_ALIGNMENT, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_FLIP_Y_WEBGL, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.PACK_ROW_LENGTH, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.PACK_SKIP_PIXELS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.PACK_SKIP_ROWS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.READ_FRAMEBUFFER_BINDING, readFramebuffer), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_ROW_LENGTH, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_IMAGE_HEIGHT, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_SKIP_PIXELS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_SKIP_ROWS, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, GL.UNPACK_SKIP_IMAGES, pixelStorei), _GL_PARAMETER_SETTERS);

// COMPOSITE_WEBGL_PARAMETER_
var COMPOSITE_GL_PARAMETER_SETTERS = {
  blendEquation: function blendEquation(gl, values) {
    return gl.blendEquationSeparate(values[GL.BLEND_EQUATION_RGB], values[GL.BLEND_EQUATION_ALPHA]);
  },
  blendFunc: function blendFunc(gl, values) {
    return gl.blendFuncSeparate(values[GL.BLEND_SRC_RGB], values[GL.BLEND_DST_RGB], values[GL.BLEND_SRC_ALPHA], values[GL.BLEND_DST_ALPHA]);
  },
  polygonOffset: function polygonOffset(gl, values) {
    return gl.polygonOffset(values[GL.POLYGON_OFFSET_FACTOR], values[GL.POLYGON_OFFSET_UNITS]);
  },
  sampleCoverage: function sampleCoverage(gl, values) {
    return gl.sampleCoverage(values[GL.SAMPLE_COVERAGE_VALUE], values[GL.SAMPLE_COVERAGE_INVERT]);
  },
  stencilFuncFront: function stencilFuncFront(gl, values) {
    return gl.stencilFuncSeparate(GL.FRONT, values[GL.STENCIL_FUNC], values[GL.STENCIL_REF], values[GL.STENCIL_VALUE_MASK]);
  },
  stencilFuncBack: function stencilFuncBack(gl, values) {
    return gl.stencilFuncSeparate(GL.BACK, values[GL.STENCIL_BACK_FUNC], values[GL.STENCIL_BACK_REF], values[GL.STENCIL_BACK_VALUE_MASK]);
  },
  stencilOpFront: function stencilOpFront(gl, values) {
    return gl.stencilOpSeparate(GL.FRONT, values[GL.STENCIL_FAIL], values[GL.STENCIL_PASS_DEPTH_FAIL], values[GL.STENCIL_PASS_DEPTH_PASS]);
  },
  stencilOpBack: function stencilOpBack(gl, values) {
    return gl.stencilOpSeparate(GL.BACK, values[GL.STENCIL_BACK_FAIL], values[GL.STENCIL_BACK_PASS_DEPTH_FAIL], values[GL.STENCIL_BACK_PASS_DEPTH_PASS]);
  }
};

// GETTER TABLE - FOR READING OUT AN ENTIRE CONTEXT

var isEnabled = function isEnabled(gl, key) {
  return gl.isEnabled(key);
};

// Exceptions for any keys that cannot be queried by gl.getParameters
export var GL_PARAMETER_GETTERS = (_GL_PARAMETER_GETTERS = {}, _defineProperty(_GL_PARAMETER_GETTERS, GL.BLEND, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.CULL_FACE, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.DEPTH_TEST, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.DITHER, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.POLYGON_OFFSET_FILL, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.SAMPLE_ALPHA_TO_COVERAGE, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.SAMPLE_COVERAGE, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.SCISSOR_TEST, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.STENCIL_TEST, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, GL.RASTERIZER_DISCARD, isEnabled), _GL_PARAMETER_GETTERS);

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
export function setParameter(gl, key, value) {
  var getter = GL_PARAMETER_GETTERS[key];
  var prevValue = getter ? getter(gl, Number(key)) : gl.getParameter(Number(key));
  var setter = GL_PARAMETER_SETTERS[key];
  assert(typeof setter === 'function');
  setter(gl, value, Number(key));
  return prevValue;
}

// Sets any GL parameter regardless of function (gl.blendMode, ...)
// Note: requires a `cache` object to be set on the context (gl.state.cache)
// This object is used to fill in any missing values for composite setter functions
export function setParameters(gl, values) {
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
export function getParameter(gl, key) {
  var getter = GL_PARAMETER_GETTERS[key];
  return getter ? getter(gl, Number(key)) : gl.getParameter(Number(key));
}

// Copies the state from a context (gl.getParameter should not be overriden)
// Reads the entire WebGL state from a context
// Caveat: This generates a huge amount of synchronous driver roundtrips and should be
// considered a very slow operation, to be used only if/when a context already manipulated
// by external code needs to be synchronized for the first time
// @return {Object} - a newly created map, with values keyed by GL parameters
export function getParameters(gl, parameters) {
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

export function getDefaultParameters(gl) {
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
export function resetParameters(gl) {
  setParameters(gl, getDefaultParameters(gl));
}

// Get all parameters that have been modified from a pure context state
export function getModifiedParameters(gl) {
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