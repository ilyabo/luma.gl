'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebug = enableDebug;
exports.makeDebugContext = makeDebugContext;
exports.getRealContext = getRealContext;
exports.getDebugContext = getDebugContext;

var _webglDebug = require('webgl-debug');

var _webglDebug2 = _interopRequireDefault(_webglDebug);

var _utils = require('../utils');

var _debugParameters = require('./api/debug-parameters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // Khronos Debug support module


(0, _debugParameters.installParameterDefinitions)();

// Helper to get shared context data
function getContextData(gl) {
  gl.luma = gl.luma || {};
  return gl.luma;
}

// Enable or disable debug checks in debug contexts
// Non-debug contexts do not have checks (to ensure performance)
// Turning off debug for debug contexts removes most of the performance penalty
function enableDebug(debug) {
  _utils.log.debug = debug;
}

// Returns (a potentially new) context with debug instrumentation turned off or on.
// Note that this actually returns a new context
function makeDebugContext(gl) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      debug = _ref.debug;

  if (gl === null) {
    // Return to ensure we don't create a context in this case.
    return null;
  }

  return debug ? getDebugContext(gl) : getRealContext(gl);
}

// Returns the real context from either of the real/debug contexts
function getRealContext(gl) {
  if (gl === null) {
    // Return to ensure we don't create a context in this case.
    return null;
  }

  var data = getContextData(gl);
  // If the context has a realContext member, it is a debug context so return the realContext
  return data.realContext ? data.realContext : gl;
}

// Returns the debug context from either of the real/debug contexts
function getDebugContext(gl) {
  if (gl === null) {
    // Return to ensure we don't create a context in this case.
    return null;
  }

  var data = getContextData(gl);
  // If this *is* a debug context, return itself
  if (data.realContext) {
    return gl;
  }

  // If this already has a debug context, return it.
  if (data.debugContext) {
    return data.debugContext;
  }

  // Create a new debug context

  var WebGLDebugContext = /*#__PURE__*/function WebGLDebugContext() {
    _classCallCheck(this, WebGLDebugContext);
  };

  var debugContext = _webglDebug2.default.makeDebugContext(gl, throwOnError, validateArgsAndLog);
  Object.assign(WebGLDebugContext.prototype, debugContext);

  // Store the debug context
  data.debugContext = debugContext;
  debugContext.debug = true;
  debugContext.gl = gl;

  // Return it
  return debugContext;
}

// DEBUG TRACING

function getFunctionString(functionName, functionArgs) {
  var args = _webglDebug2.default.glFunctionArgsToString(functionName, functionArgs);
  args = '' + args.slice(0, 100) + (args.length > 100 ? '...' : '');
  return 'gl.' + functionName + '(' + args + ')';
}

function throwOnError(err, functionName, args) {
  if (!_utils.log.nothrow) {
    var errorMessage = _webglDebug2.default.glEnumToString(err);
    var functionArgs = _webglDebug2.default.glFunctionArgsToString(functionName, args);
    throw new Error(errorMessage + ' in gl.' + functionName + '(' + functionArgs + ')');
  }
}

// Don't generate function string until it is needed
function validateArgsAndLog(functionName, functionArgs) {
  if (!_utils.log.debug) {
    return;
  }

  var functionString = void 0;
  if (_utils.log.priority >= 4) {
    functionString = getFunctionString(functionName, functionArgs);
    _utils.log.info(4, '' + functionString);
  }

  if (_utils.log.break) {
    functionString = functionString || getFunctionString(functionName, functionArgs);
    var isBreakpoint = _utils.log.break && _utils.log.break.every(function (breakOn) {
      return functionString.indexOf(breakOn) !== -1;
    });
    if (isBreakpoint) {
      /* eslint-disable no-debugger */
      debugger;
      /* eslint-enable no-debugger */
    }
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = functionArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var arg = _step.value;

      if (arg === undefined) {
        functionString = functionString || getFunctionString(functionName, functionArgs);
        throw new Error('Undefined argument: ' + functionString);
      }
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
}
//# sourceMappingURL=context-debug.js.map