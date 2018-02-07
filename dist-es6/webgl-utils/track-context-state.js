var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Support for listening to context state changes and intercepting state queries
//
// NOTE: this system does not handle buffer bindings
import GL from './constants';
import { setParameters, getParameters, GL_PARAMETER_DEFAULTS } from './set-parameters';
import polyfillContext from './polyfill-context';
import assert from 'assert';

export var clone = function clone(x) {
  return Array.isArray(x) || ArrayBuffer.isView(x) ? x.slice() : x;
};

export var deepEqual = function deepEqual(x, y) {
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
  return x === y;
};

// interceptors for WEBGL FUNCTIONS that set WebGLRenderingContext state
// These "setters" map functions to gl parameters

var GL_STATE_SETTERS = {

  // GENERIC SETTERS

  enable: function enable(update, cap) {
    return update(_defineProperty({}, cap, true));
  },
  disable: function disable(update, cap) {
    return update(_defineProperty({}, cap, false));
  },
  pixelStorei: function pixelStorei(update, pname, param) {
    return update(_defineProperty({}, pname, param));
  },
  hint: function hint(update, pname, _hint) {
    return update(_defineProperty({}, pname, _hint));
  },

  // SPECIFIC SETTERS

  bindFramebuffer: function bindFramebuffer(update, target, fb) {
    var _update5;

    switch (target) {
      case GL.FRAMEBUFFER:
        return update((_update5 = {}, _defineProperty(_update5, GL.DRAW_FRAMEBUFFER_BINDING, fb), _defineProperty(_update5, GL.READ_FRAMEBUFFER_BINDING, fb), _update5));
      case GL.DRAW_FRAMEBUFFER:
        return update(_defineProperty({}, GL.DRAW_FRAMEBUFFER_BINDING, fb));
      case GL.READ_FRAMEBUFFER:
        return update(_defineProperty({}, GL.READ_FRAMEBUFFER_BINDING, fb));
      default:
        return null;
    }
  },
  blendColor: function blendColor(update, r, g, b, a) {
    return update(_defineProperty({}, GL.BLEND_COLOR, new Float32Array([r, g, b, a])));
  },

  blendEquation: function blendEquation(update, mode) {
    var _update9;

    return update((_update9 = {}, _defineProperty(_update9, GL.BLEND_EQUATION_RGB, mode), _defineProperty(_update9, GL.BLEND_EQUATION_ALPHA, mode), _update9));
  },

  blendEquationSeparate: function blendEquationSeparate(update, modeRGB, modeAlpha) {
    var _update10;

    return update((_update10 = {}, _defineProperty(_update10, GL.BLEND_EQUATION_RGB, modeRGB), _defineProperty(_update10, GL.BLEND_EQUATION_ALPHA, modeAlpha), _update10));
  },

  blendFunc: function blendFunc(update, src, dst) {
    var _update11;

    return update((_update11 = {}, _defineProperty(_update11, GL.BLEND_SRC_RGB, src), _defineProperty(_update11, GL.BLEND_DST_RGB, dst), _defineProperty(_update11, GL.BLEND_SRC_ALPHA, src), _defineProperty(_update11, GL.BLEND_DST_ALPHA, dst), _update11));
  },

  blendFuncSeparate: function blendFuncSeparate(update, srcRGB, dstRGB, srcAlpha, dstAlpha) {
    var _update12;

    return update((_update12 = {}, _defineProperty(_update12, GL.BLEND_SRC_RGB, srcRGB), _defineProperty(_update12, GL.BLEND_DST_RGB, dstRGB), _defineProperty(_update12, GL.BLEND_SRC_ALPHA, srcAlpha), _defineProperty(_update12, GL.BLEND_DST_ALPHA, dstAlpha), _update12));
  },

  clearColor: function clearColor(update, r, g, b, a) {
    return update(_defineProperty({}, GL.COLOR_CLEAR_VALUE, new Float32Array([r, g, b, a])));
  },

  clearDepth: function clearDepth(update, depth) {
    return update(_defineProperty({}, GL.DEPTH_CLEAR_VALUE, depth));
  },

  clearStencil: function clearStencil(update, s) {
    return update(_defineProperty({}, GL.STENCIL_CLEAR_VALUE, s));
  },

  colorMask: function colorMask(update, r, g, b, a) {
    return update(_defineProperty({}, GL.COLOR_WRITEMASK, [r, g, b, a]));
  },

  cullFace: function cullFace(update, mode) {
    return update(_defineProperty({}, GL.CULL_FACE_MODE, mode));
  },

  depthFunc: function depthFunc(update, func) {
    return update(_defineProperty({}, GL.DEPTH_FUNC, func));
  },

  depthRange: function depthRange(update, zNear, zFar) {
    return update(_defineProperty({}, GL.DEPTH_RANGE, new Float32Array([zNear, zFar])));
  },

  depthMask: function depthMask(update, mask) {
    return update(_defineProperty({}, GL.DEPTH_WRITEMASK, mask));
  },

  frontFace: function frontFace(update, face) {
    return update(_defineProperty({}, GL.FRONT_FACE, face));
  },

  lineWidth: function lineWidth(update, width) {
    return update(_defineProperty({}, GL.LINE_WIDTH, width));
  },

  polygonOffset: function polygonOffset(update, factor, units) {
    var _update23;

    return update((_update23 = {}, _defineProperty(_update23, GL.POLYGON_OFFSET_FACTOR, factor), _defineProperty(_update23, GL.POLYGON_OFFSET_UNITS, units), _update23));
  },

  sampleCoverage: function sampleCoverage(update, value, invert) {
    var _update24;

    return update((_update24 = {}, _defineProperty(_update24, GL.SAMPLE_COVERAGE_VALUE, value), _defineProperty(_update24, GL.SAMPLE_COVERAGE_INVERT, invert), _update24));
  },

  scissor: function scissor(update, x, y, width, height) {
    return update(_defineProperty({}, GL.SCISSOR_BOX, new Int32Array([x, y, width, height])));
  },

  stencilMask: function stencilMask(update, mask) {
    var _update26;

    return update((_update26 = {}, _defineProperty(_update26, GL.STENCIL_WRITEMASK, mask), _defineProperty(_update26, GL.STENCIL_BACK_WRITEMASK, mask), _update26));
  },

  stencilMaskSeparate: function stencilMaskSeparate(update, face, mask) {
    return update(_defineProperty({}, face === GL.FRONT ? GL.STENCIL_WRITEMASK : GL.STENCIL_BACK_WRITEMASK, mask));
  },

  stencilFunc: function stencilFunc(update, func, ref, mask) {
    var _update28;

    return update((_update28 = {}, _defineProperty(_update28, GL.STENCIL_FUNC, func), _defineProperty(_update28, GL.STENCIL_REF, ref), _defineProperty(_update28, GL.STENCIL_VALUE_MASK, mask), _defineProperty(_update28, GL.STENCIL_BACK_FUNC, func), _defineProperty(_update28, GL.STENCIL_BACK_REF, ref), _defineProperty(_update28, GL.STENCIL_BACK_VALUE_MASK, mask), _update28));
  },

  stencilFuncSeparate: function stencilFuncSeparate(update, face, func, ref, mask) {
    var _update29;

    return update((_update29 = {}, _defineProperty(_update29, face === GL.FRONT ? GL.STENCIL_FUNC : GL.STENCIL_BACK_FUNC, func), _defineProperty(_update29, face === GL.FRONT ? GL.STENCIL_REF : GL.STENCIL_BACK_REF, ref), _defineProperty(_update29, face === GL.FRONT ? GL.STENCIL_VALUE_MASK : GL.STENCIL_BACK_VALUE_MASK, mask), _update29));
  },

  stencilOp: function stencilOp(update, fail, zfail, zpass) {
    var _update30;

    return update((_update30 = {}, _defineProperty(_update30, GL.STENCIL_FAIL, fail), _defineProperty(_update30, GL.STENCIL_PASS_DEPTH_FAIL, zfail), _defineProperty(_update30, GL.STENCIL_PASS_DEPTH_PASS, zpass), _defineProperty(_update30, GL.STENCIL_BACK_FAIL, fail), _defineProperty(_update30, GL.STENCIL_BACK_PASS_DEPTH_FAIL, zfail), _defineProperty(_update30, GL.STENCIL_BACK_PASS_DEPTH_PASS, zpass), _update30));
  },

  stencilOpSeparate: function stencilOpSeparate(update, face, fail, zfail, zpass) {
    var _update31;

    return update((_update31 = {}, _defineProperty(_update31, face === GL.FRONT ? GL.STENCIL_FAIL : GL.STENCIL_BACK_FAIL, fail), _defineProperty(_update31, face === GL.FRONT ? GL.STENCIL_PASS_DEPTH_FAIL : GL.STENCIL_BACK_PASS_DEPTH_FAIL, zfail), _defineProperty(_update31, face === GL.FRONT ? GL.STENCIL_PASS_DEPTH_PASS : GL.STENCIL_BACK_PASS_DEPTH_PASS, zpass), _update31));
  },

  viewport: function viewport(update, x, y, width, height) {
    return update(_defineProperty({}, GL.VIEWPORT, new Int32Array([x, y, width, height])));
  }
};

// HELPER FUNCTIONS - INSTALL GET/SET INTERCEPTORS (SPYS) ON THE CONTEXT

// Overrides a WebGLRenderingContext state "getter" function
// to return values directly from cache
export { GL_STATE_SETTERS };
function installGetterOverride(gl, functionName) {
  // Get the original function from the WebGLRenderingContext
  var originalGetterFunc = gl[functionName].bind(gl);

  // Wrap it with a spy so that we can update our state cache when it gets called
  gl[functionName] = function () {
    var pname = arguments.length <= 0 ? undefined : arguments[0];

    // WebGL limits are not prepopulated in the cache, we must
    // query first time. They are all primitive (single value)
    if (!(pname in gl.state.cache)) {
      gl.state.cache[pname] = originalGetterFunc.apply(undefined, arguments);
    }

    // Optionally call the original function to do a "hard" query from the WebGLRenderingContext
    return gl.state.enable ?
    // Call the getter the params so that it can e.g. serve from a cache
    gl.state.cache[pname] :
    // Optionally call the original function to do a "hard" query from the WebGLRenderingContext
    originalGetterFunc.apply(undefined, arguments);
  };

  // Set the name of this anonymous function to help in debugging and profiling
  Object.defineProperty(gl[functionName], 'name', { value: functionName + '-from-cache', configurable: false });
}

// Overrides a WebGLRenderingContext state "setter" function
// to call a setter spy before the actual setter. Allows us to keep a cache
// updated with a copy of the WebGL context state.
function installSetterSpy(gl, functionName, setter) {
  // Get the original function from the WebGLRenderingContext
  var originalSetterFunc = gl[functionName].bind(gl);

  // Wrap it with a spy so that we can update our state cache when it gets called
  gl[functionName] = function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    // Update the value
    // Call the setter with the state cache and the params so that it can store the parameters
    var _setter = setter.apply(undefined, [gl.state._updateCache].concat(params)),
        valueChanged = _setter.valueChanged,
        oldValue = _setter.oldValue;

    // Call the original WebGLRenderingContext func to make sure the context actually gets updated


    if (valueChanged) {
      var _gl$state;

      (_gl$state = gl.state).log.apply(_gl$state, ['gl.' + functionName].concat(params)); // eslint-disable-line
      originalSetterFunc.apply(undefined, params);
    }

    // Note: if the original function fails to set the value, our state cache will be bad
    // No solution for this at the moment, but assuming that this is unlikely to be a real problem
    // We could call the setter after the originalSetterFunc. Concern is that this would
    // cause different behavior in debug mode, where originalSetterFunc can throw exceptions

    return oldValue;
  };

  // Set the name of this anonymous function to help in debugging and profiling
  Object.defineProperty(gl[functionName], 'name', { value: functionName + '-to-cache', configurable: false });
}

// HELPER CLASS - GLState

/* eslint-disable no-shadow */

var GLState = /*#__PURE__*/function () {
  function GLState(gl) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$copyState = _ref.copyState,
        copyState = _ref$copyState === undefined ? false : _ref$copyState,
        _ref$log = _ref.log,
        log = _ref$log === undefined ? function () {} : _ref$log;

    _classCallCheck(this, GLState);

    this.gl = gl;
    this.stateStack = [];
    this.enable = true;
    this.cache = copyState ? getParameters(gl) : Object.assign({}, GL_PARAMETER_DEFAULTS);
    this.log = log;

    this._updateCache = this._updateCache.bind(this);
    Object.seal(this);
  }

  _createClass(GLState, [{
    key: 'push',
    value: function push() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.stateStack.push({});
    }
  }, {
    key: 'pop',
    value: function pop() {
      assert(this.stateStack.length > 0);
      // Use the saved values in the state stack to restore parameters
      var oldValues = this.stateStack[this.stateStack.length - 1];
      setParameters(this.gl, oldValues, this.cache);
      // Don't pop until we have reset parameters (to make sure other "stack frames" are not affected)
      this.stateStack.pop();
    }

    // interceptor for context set functions - update our cache and our stack
    // values (Object) - the key values for this setter

  }, {
    key: '_updateCache',
    value: function _updateCache(values) {
      var valueChanged = false;
      var oldValue = void 0; // = undefined

      var oldValues = this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1];

      for (var key in values) {
        assert(key !== undefined);
        // Check that value hasn't already been shadowed
        if (!deepEqual(values[key], this.cache[key])) {
          valueChanged = true;
          oldValue = this.cache[key];

          // First, save current value being shadowed
          // If a state stack frame is active, save the current parameter values for pop
          // but first check that value hasn't already been shadowed and saved
          if (oldValues && !(key in oldValues)) {
            oldValues[key] = this.cache[key];
          }

          // Save current value being shadowed
          this.cache[key] = values[key];
        }
      }

      return { valueChanged: valueChanged, oldValue: oldValue };
    }
  }]);

  return GLState;
}();

// PUBLIC API

/**
 * Initialize WebGL state caching on a context
 * can be called multiple times to enable/disable
 * @param {WebGLRenderingContext} - context
 */
// After calling this function, context state will be cached
// gl.state.push() and gl.state.pop() will be available for saving,
// temporarily modifying, and then restoring state.


export default function trackContextState(gl) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$enable = _ref2.enable,
      enable = _ref2$enable === undefined ? true : _ref2$enable,
      copyState = _ref2.copyState;

  assert(copyState !== undefined);
  if (!gl.state) {
    polyfillContext(gl);

    // Create a state cache
    gl.state = new GLState(gl, { copyState: copyState, enable: enable });

    // intercept all setter functions in the table
    for (var key in GL_STATE_SETTERS) {
      var setter = GL_STATE_SETTERS[key];
      installSetterSpy(gl, key, setter);
    }

    // intercept all getter functions in the table
    installGetterOverride(gl, 'getParameter');
    installGetterOverride(gl, 'isEnabled');
  }

  gl.state.enable = enable;

  return gl;
}

export function pushContextState(gl) {
  assert(gl.state);
  gl.state.push();
}

export function popContextState(gl) {
  assert(gl.state);
  gl.state.pop();
}
//# sourceMappingURL=track-context-state.js.map