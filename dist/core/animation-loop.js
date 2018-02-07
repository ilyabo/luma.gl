'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window, setTimeout, clearTimeout */


exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;

var _utils = require('../utils');

var _webglUtils = require('../webgl-utils');

var _webgl = require('../webgl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Node.js polyfills for requestAnimationFrame and cancelAnimationFrame
function requestAnimationFrame(callback) {
  return _utils.isBrowser ? window.requestAnimationFrame(callback) : setTimeout(callback, 1000 / 60);
}

function cancelAnimationFrame(timerId) {
  return _utils.isBrowser ? window.cancelAnimationFrame(timerId) : clearTimeout(timerId);
}

var AnimationLoop = /*#__PURE__*/function () {
  /*
   * @param {HTMLCanvasElement} canvas - if provided, width and height will be passed to context
   */
  function AnimationLoop() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$onCreateContext = _ref.onCreateContext,
        onCreateContext = _ref$onCreateContext === undefined ? function (opts) {
      return (0, _webgl.createGLContext)(opts);
    } : _ref$onCreateContext,
        _ref$onDeleteContext = _ref.onDeleteContext,
        onDeleteContext = _ref$onDeleteContext === undefined ? function (gl) {
      return (0, _webgl.deleteGLContext)(gl);
    } : _ref$onDeleteContext,
        _ref$onInitialize = _ref.onInitialize,
        onInitialize = _ref$onInitialize === undefined ? function () {} : _ref$onInitialize,
        _ref$onRender = _ref.onRender,
        onRender = _ref$onRender === undefined ? function () {} : _ref$onRender,
        _ref$onFinalize = _ref.onFinalize,
        onFinalize = _ref$onFinalize === undefined ? function () {} : _ref$onFinalize,
        _ref$gl = _ref.gl,
        gl = _ref$gl === undefined ? null : _ref$gl,
        _ref$glOptions = _ref.glOptions,
        glOptions = _ref$glOptions === undefined ? {
      preserveDrawingBuffer: true
    } : _ref$glOptions,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? null : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? null : _ref$height,
        _ref$createFramebuffe = _ref.createFramebuffer,
        createFramebuffer = _ref$createFramebuffe === undefined ? false : _ref$createFramebuffe,
        _ref$autoResizeViewpo = _ref.autoResizeViewport,
        autoResizeViewport = _ref$autoResizeViewpo === undefined ? true : _ref$autoResizeViewpo,
        _ref$autoResizeCanvas = _ref.autoResizeCanvas,
        autoResizeCanvas = _ref$autoResizeCanvas === undefined ? true : _ref$autoResizeCanvas,
        _ref$autoResizeDrawin = _ref.autoResizeDrawingBuffer,
        autoResizeDrawingBuffer = _ref$autoResizeDrawin === undefined ? true : _ref$autoResizeDrawin,
        _ref$useDevicePixelRa = _ref.useDevicePixelRatio,
        useDevicePixelRatio = _ref$useDevicePixelRa === undefined ? null : _ref$useDevicePixelRa,
        _ref$useDevicePixels = _ref.useDevicePixels,
        useDevicePixels = _ref$useDevicePixels === undefined ? true : _ref$useDevicePixels;

    _classCallCheck(this, AnimationLoop);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this._renderFrame = this._renderFrame.bind(this);

    if (useDevicePixelRatio !== null) {
      _utils.log.deprecated('useDevicePixelRatio', 'useDevicePixels');
      useDevicePixels = useDevicePixelRatio;
    }

    this.setViewParameters({
      autoResizeViewport: autoResizeViewport,
      autoResizeCanvas: autoResizeCanvas,
      autoResizeDrawingBuffer: autoResizeDrawingBuffer,
      useDevicePixels: useDevicePixels
    });

    this._onCreateContext = onCreateContext;
    this.glOptions = glOptions;
    this._createFramebuffer = createFramebuffer;

    this._onInitialize = onInitialize;
    this._onRender = onRender;
    this._onFinalize = onFinalize;

    this.width = width;
    this.height = height;

    this.gl = gl;

    return this;
  }

  // Update parameters (TODO - should these be specified in `start`?)


  _createClass(AnimationLoop, [{
    key: 'setViewParameters',
    value: function setViewParameters(_ref2) {
      var _ref2$autoResizeDrawi = _ref2.autoResizeDrawingBuffer,
          autoResizeDrawingBuffer = _ref2$autoResizeDrawi === undefined ? true : _ref2$autoResizeDrawi,
          _ref2$autoResizeCanva = _ref2.autoResizeCanvas,
          autoResizeCanvas = _ref2$autoResizeCanva === undefined ? true : _ref2$autoResizeCanva,
          _ref2$autoResizeViewp = _ref2.autoResizeViewport,
          autoResizeViewport = _ref2$autoResizeViewp === undefined ? true : _ref2$autoResizeViewp,
          _ref2$useDevicePixels = _ref2.useDevicePixels,
          useDevicePixels = _ref2$useDevicePixels === undefined ? true : _ref2$useDevicePixels,
          _ref2$useDevicePixelR = _ref2.useDevicePixelRatio,
          useDevicePixelRatio = _ref2$useDevicePixelR === undefined ? null : _ref2$useDevicePixelR;

      this.autoResizeViewport = autoResizeViewport;
      this.autoResizeCanvas = autoResizeCanvas;
      this.autoResizeDrawingBuffer = autoResizeDrawingBuffer;
      this.useDevicePixels = useDevicePixels;
      if (useDevicePixelRatio !== null) {
        _utils.log.deprecated('useDevicePixelRatio', 'useDevicePixels');
        this.useDevicePixels = useDevicePixelRatio;
      }
      return this;
    }

    // Starts a render loop if not already running
    // @param {Object} context - contains frame specific info (E.g. tick, width, height, etc)

  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._stopped = false;
      // console.debug(`Starting ${this.constructor.name}`);
      if (!this._animationFrameId) {
        // Wait for start promise before rendering frame
        this._startPromise = (0, _webglUtils.getPageLoadPromise)().then(function () {
          if (_this._stopped) {
            return null;
          }

          // Create the WebGL context
          _this._createWebGLContext(opts);

          // Initialize the callback data
          _this._initializeCallbackData();
          _this._updateCallbackData();

          // Default viewport setup, in case onInitialize wants to render
          _this._resizeCanvasDrawingBuffer();
          _this._resizeViewport();

          // Note: onIntialize can return a promise (in case it needs to load resources)
          return _this._onInitialize(_this._callbackData);
        }).then(function (appContext) {
          if (!_this._stopped) {
            _this._addCallbackData(appContext || {});
            if (appContext !== false && !_this._animationFrameId) {
              _this._animationFrameId = requestAnimationFrame(_this._renderFrame);
            }
          }
        });
      }
      return this;
    }

    // Stops a render loop if already running, finalizing

  }, {
    key: 'stop',
    value: function stop() {
      // console.debug(`Stopping ${this.constructor.name}`);
      if (this._animationFrameId) {
        this._finalizeCallbackData();
        cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
        this._stopped = true;
      }
      return this;
    }

    // PRIVATE METHODS

  }, {
    key: '_setupFrame',
    value: function _setupFrame() {
      if (this._onSetupFrame) {
        // call callback
        this._onSetupFrame(this._callbackData);
        // end callback
      } else {
        this._resizeCanvasDrawingBuffer();
        this._resizeViewport();
        this._resizeFramebuffer();
      }
    }

    /**
     * @private
     * Handles a render loop frame- updates context and calls the application
     * callback
     */

  }, {
    key: '_renderFrame',
    value: function _renderFrame() {
      this._setupFrame();
      this._updateCallbackData();

      // call callback
      this._onRender(this._callbackData);
      // end callback

      // Increment tick
      this._callbackData.tick++;

      if (!this._stopped) {
        // Request another render frame (now )
        this._animationFrameId = requestAnimationFrame(this._renderFrame);
      }
    }

    // Initialize the  object that will be passed to app callbacks

  }, {
    key: '_initializeCallbackData',
    value: function _initializeCallbackData() {
      this._callbackData = {
        gl: this.gl,
        canvas: this.gl.canvas,
        framebuffer: this.framebuffer,
        stop: this.stop,
        // Initial values
        tick: 0,
        tock: 0,
        useDevicePixels: this.useDevicePixels
      };
    }

    // Update the context object that will be passed to app callbacks

  }, {
    key: '_updateCallbackData',
    value: function _updateCallbackData() {
      // CallbackData width and height represent drawing buffer width and height
      var canvas = this.gl.canvas;

      this._callbackData.width = canvas.width;
      this._callbackData.height = canvas.height;
      this._callbackData.aspect = canvas.width / canvas.height;
    }
  }, {
    key: '_finalizeCallbackData',
    value: function _finalizeCallbackData() {
      // call callback
      this._onFinalize(this._callbackData);
      // end callback
    }

    // Add application's data to the app context object

  }, {
    key: '_addCallbackData',
    value: function _addCallbackData(appContext) {
      if ((typeof appContext === 'undefined' ? 'undefined' : _typeof(appContext)) === 'object' && appContext !== null) {
        this._callbackData = Object.assign({}, this._callbackData, appContext);
      }
    }

    // Either uses supplied or existing context, or calls provided callback to create one

  }, {
    key: '_createWebGLContext',
    value: function _createWebGLContext(opts) {
      // Create the WebGL context if necessary
      opts = Object.assign({}, opts, this.glOptions);
      if (opts.gl) {
        this.gl = opts.gl;
      } else {
        this.gl = this._onCreateContext(opts);
      }
      if (!(0, _webgl.isWebGL)(this.gl)) {
        throw new Error('AnimationLoop.onCreateContext - illegal context returned');
      }

      // Setup default framebuffer
      if (this._createFramebuffer) {
        this.framebuffer = new _webgl.Framebuffer(this.gl);
      }
      // Reset the WebGL context.
      (0, _webgl.resetParameters)(this.gl);
    }

    // Default viewport setup

  }, {
    key: '_resizeViewport',
    value: function _resizeViewport() {
      if (this.autoResizeViewport) {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      }
    }
  }, {
    key: '_resizeFramebuffer',
    value: function _resizeFramebuffer() {
      if (this.framebuffer) {
        this.framebuffer.resize({ width: this.gl.canvas.width, height: this.gl.canvas.height });
      }
    }

    // Resize the render buffer of the canvas to match canvas client size
    // Optionally multiplying with devicePixel ratio

  }, {
    key: '_resizeCanvasDrawingBuffer',
    value: function _resizeCanvasDrawingBuffer() {
      if (this.autoResizeDrawingBuffer) {
        (0, _webglUtils.resizeDrawingBuffer)(this.gl.canvas, { useDevicePixels: this.useDevicePixels });
      }
    }
  }]);

  return AnimationLoop;
}();

exports.default = AnimationLoop;
//# sourceMappingURL=animation-loop.js.map