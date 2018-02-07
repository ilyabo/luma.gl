'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERR_WEBGL2 = exports.ERR_WEBGL = exports.ERR_CONTEXT = undefined;
exports.isWebGL = isWebGL;
exports.isWebGL2 = isWebGL2;
exports.assertWebGLContext = assertWebGLContext;
exports.assertWebGL2Context = assertWebGL2Context;
exports.setContextDefaults = setContextDefaults;
exports.createGLContext = createGLContext;
exports.deleteGLContext = deleteGLContext;
exports.pollContext = pollContext;

var _api = require('./api');

var _trackContextState = require('../webgl-utils/track-context-state');

var _trackContextState2 = _interopRequireDefault(_trackContextState);

var _webglUtils = require('../webgl-utils');

var _contextDebug = require('./context-debug');

var _contextLimits = require('./context-limits');

var _queryManager = require('./helpers/query-manager');

var _queryManager2 = _interopRequireDefault(_queryManager);

var _utils = require('../utils');

var _init = require('../init');

var _init2 = _interopRequireDefault(_init);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Heuristic testing of contexts (to indentify debug wrappers around gl contexts)
var GL_ARRAY_BUFFER = 0x8892; // WebGLRenderingContext related methods

var GL_TEXTURE_BINDING_3D = 0x806A;

var ERR_CONTEXT = exports.ERR_CONTEXT = 'Invalid WebGLRenderingContext';
var ERR_WEBGL = exports.ERR_WEBGL = ERR_CONTEXT;
var ERR_WEBGL2 = exports.ERR_WEBGL2 = 'Requires WebGL2';

var ERR_WEBGL_MISSING_NODE = 'WebGL API is missing. To run luma.gl under Node.js, please "npm install gl"\nand import \'luma.gl/headless\' before importing \'luma.gl\'.';

var ERR_HEADLESSGL_NOT_AVAILABLE = 'Cannot create headless WebGL context, headlessGL not available';

var ERR_HEADLESSGL_FAILED = 'headlessGL failed to create headless WebGL context';

function isWebGL(gl) {
  return Boolean(gl && (gl instanceof _api.WebGLRenderingContext || gl.ARRAY_BUFFER === GL_ARRAY_BUFFER));
}

function isWebGL2(gl) {
  return Boolean(gl && (gl instanceof _api.WebGL2RenderingContext || gl.TEXTURE_BINDING_3D === GL_TEXTURE_BINDING_3D));
}

function assertWebGLContext(gl) {
  // Need to handle debug context
  (0, _assert2.default)(isWebGL(gl), ERR_CONTEXT);
}

function assertWebGL2Context(gl) {
  // Need to handle debug context
  (0, _assert2.default)(isWebGL2(gl), ERR_WEBGL2);
}

var contextDefaults = {
  // COMMON CONTEXT PARAMETERS
  // Attempt to allocate WebGL2 context
  webgl2: true, // Attempt to create a WebGL2 context (false to force webgl1)
  webgl1: true, // Attempt to create a WebGL1 context (false to fail if webgl2 not available)
  throwOnFailure: true,
  manageState: true,
  // BROWSER CONTEXT PARAMETERS
  canvas: null, // A canvas element or a canvas string id
  debug: false, // Instrument context (at the expense of performance)
  // HEADLESS CONTEXT PARAMETERS
  width: 800, // width are height are only used by headless gl
  height: 600
  // WEBGL/HEADLESS CONTEXT PARAMETERS
  // Remaining options are passed through to context creator
};

/*
 * Change default context creation parameters.
 * Main use case is regression test suite.
 */
function setContextDefaults() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  Object.assign(contextDefaults, { width: 1, height: 1 }, opts);
}

/*
 * Creates a context giving access to the WebGL API
 */
/* eslint-disable complexity, max-statements */
function createGLContext() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  opts = Object.assign({}, contextDefaults, opts);
  var _opts = opts,
      canvas = _opts.canvas,
      width = _opts.width,
      height = _opts.height,
      throwOnError = _opts.throwOnError,
      manageState = _opts.manageState,
      debug = _opts.debug;

  // Error reporting function, enables exceptions to be disabled

  function onError(message) {
    if (throwOnError) {
      throw new Error(message);
    }
    // log.log(0, message);
    return null;
  }

  var gl = void 0;
  if (_utils.isBrowser) {
    // Make sure we have a real canvas ("canvas" can a string, a canvas or null)
    var realCanvas = void 0;
    if (!canvas) {
      realCanvas = (0, _webglUtils.createCanvas)({ id: 'lumagl-canvas', width: width, height: height, onError: onError });
    } else if (typeof canvas === 'string') {
      realCanvas = (0, _webglUtils.getCanvas)({ id: canvas });
    } else {
      realCanvas = canvas;
    }
    // Create a WebGL context in the canvas
    gl = (0, _webglUtils.createContext)({ canvas: realCanvas, opts: opts });
  } else {
    // Create a headless-gl context under Node.js
    gl = _createHeadlessContext({ width: width, height: height, opts: opts, onError: onError });
  }
  if (!gl) {
    return null;
  }

  // Install context state tracking
  if (manageState) {
    (0, _trackContextState2.default)(gl, {
      copyState: false,
      log: function log() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _utils.log.log.apply(_utils.log, [1].concat(args));
      }
    });
  }

  // Add debug instrumentation to the context
  if (_utils.isBrowser && debug) {
    gl = (0, _contextDebug.makeDebugContext)(gl, { debug: debug });
    // Debug forces log level to at least 1
    _utils.log.priority = Math.max(_utils.log.priority, 1);
    // Log some debug info about the context
  }
  logInfo(gl);

  // Add to seer integration

  return gl;
}

function deleteGLContext(gl) {}
// Remove from seer integration


// POLLING FOR PENDING QUERIES
// Calling this function checks all pending queries for completion
function pollContext(gl) {
  _queryManager2.default.poll(gl);
}

function logInfo(gl) {
  var webGL = isWebGL2(gl) ? 'WebGL2' : 'WebGL1';
  var info = (0, _contextLimits.glGetDebugInfo)(gl);
  var driver = info ? '(' + info.vendor + ',' + info.renderer + ')' : '';
  var debug = gl.debug ? ' debug' : '';
  _utils.log.once(0, '' + webGL + debug + ' context ' + driver);
}

// Create headless gl context (for running under Node.js)
function _createHeadlessContext(_ref) {
  var width = _ref.width,
      height = _ref.height,
      opts = _ref.opts,
      onError = _ref.onError;
  var webgl1 = opts.webgl1,
      webgl2 = opts.webgl2;

  if (webgl2 && !webgl1) {
    return onError('headless-gl does not support WebGL2');
  }
  if (!_api.webGLTypesAvailable) {
    return onError(ERR_WEBGL_MISSING_NODE);
  }
  if (!_init2.default.globals.headlessGL) {
    return onError(ERR_HEADLESSGL_NOT_AVAILABLE);
  }
  var gl = _init2.default.globals.headlessGL(width, height, opts);
  if (!gl) {
    return onError(ERR_HEADLESSGL_FAILED);
  }
  return gl;
}
//# sourceMappingURL=context.js.map