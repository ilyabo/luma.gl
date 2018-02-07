'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FragmentShader = exports.VertexShader = exports.Shader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webglUtils = require('../webgl-utils');

var _context = require('./context');

var _resource = require('./resource');

var _resource2 = _interopRequireDefault(_resource);

var _utils = require('../utils');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ERR_SOURCE = 'Shader: GLSL source code must be a JavaScript string';

var GL_FRAGMENT_SHADER = 0x8B30;
var GL_VERTEX_SHADER = 0x8B31;
var GL_COMPILE_STATUS = 0x8B81;
var GL_SHADER_TYPE = 0x8B4F;

// For now this is an internal class

var Shader = /*#__PURE__*/exports.Shader = function (_Resource) {
  _inherits(Shader, _Resource);

  _createClass(Shader, null, [{
    key: 'getTypeName',
    value: function getTypeName(shaderType) {
      switch (shaderType) {
        case GL_VERTEX_SHADER:
          return 'vertex-shader';
        case GL_FRAGMENT_SHADER:
          return 'fragment-shader';
        default:
          (0, _assert2.default)(false);return 'unknown';
      }
    }

    /* eslint-disable max-statements */

  }]);

  function Shader(gl, source, shaderType) {
    _classCallCheck(this, Shader);

    (0, _context.assertWebGLContext)(gl);
    (0, _assert2.default)(typeof source === 'string', ERR_SOURCE);

    var _this = _possibleConstructorReturn(this, (Shader.__proto__ || Object.getPrototypeOf(Shader)).call(this, gl, { id: (0, _webglUtils.getShaderName)(source) || (0, _utils.uid)(Shader.getTypeName(shaderType)) }));

    _this.shaderType = shaderType;
    _this.source = source;

    _this.opts.source = source;
    _this.initialize(_this.opts);
    return _this;
  }

  _createClass(Shader, [{
    key: 'initialize',
    value: function initialize(_ref) {
      var source = _ref.source;

      var shaderName = (0, _webglUtils.getShaderName)(source);
      if (shaderName) {
        this.id = (0, _utils.uid)(shaderName);
      }
      this._compile(source);
      this.opts.source = source;
    }

    // Accessors

  }, {
    key: 'getParameter',
    value: function getParameter(pname) {
      return this.gl.getShaderParameter(this.handle, pname);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.getTypeName(this.shaderType) + ':' + this.id;
    }
  }, {
    key: 'getName',
    value: function getName() {
      return (0, _webglUtils.getShaderName)(this.opts.source) || 'unnamed-shader';
    }
  }, {
    key: 'getSource',
    value: function getSource() {
      return this.gl.getShaderSource(this.handle);
    }

    // Debug method - Returns translated source if available

  }, {
    key: 'getTranslatedSource',
    value: function getTranslatedSource() {
      var extension = this.gl.getExtension('WEBGL_debug_shaders');
      return extension ? extension.getTranslatedShaderSource(this.handle) : 'No translated source available. WEBGL_debug_shaders not implemented';
    }

    // PRIVATE METHODS

  }, {
    key: '_compile',
    value: function _compile() {
      this.gl.shaderSource(this.handle, this.source);
      this.gl.compileShader(this.handle);

      // TODO - For performance reasons, avoid checking shader compilation errors on production?
      // TODO - Load log even when no error reported, to catch warnings?
      // https://gamedev.stackexchange.com/questions/30429/how-to-detect-glsl-warnings
      var compileStatus = this.getParameter(GL_COMPILE_STATUS);
      if (!compileStatus) {
        var infoLog = this.gl.getShaderInfoLog(this.handle);

        var _parseGLSLCompilerErr = (0, _webglUtils.parseGLSLCompilerError)(infoLog, this.source, this.shaderType),
            shaderName = _parseGLSLCompilerErr.shaderName,
            errors = _parseGLSLCompilerErr.errors,
            warnings = _parseGLSLCompilerErr.warnings;

        _utils.log.error('GLSL compilation errors in ' + shaderName + '\n' + errors);
        _utils.log.warn('GLSL compilation warnings in ' + shaderName + '\n' + warnings);
        throw new Error('GLSL compilation errors in ' + shaderName);
      }
    }
  }, {
    key: '_deleteHandle',
    value: function _deleteHandle() {
      this.gl.deleteShader(this.handle);
    }
  }, {
    key: '_getOptsFromHandle',
    value: function _getOptsFromHandle() {
      return {
        type: this.getParameter(GL_SHADER_TYPE),
        source: this.getSource()
      };
    }
  }]);

  return Shader;
}(_resource2.default);

var VertexShader = /*#__PURE__*/exports.VertexShader = function (_Shader) {
  _inherits(VertexShader, _Shader);

  function VertexShader(gl, source) {
    _classCallCheck(this, VertexShader);

    return _possibleConstructorReturn(this, (VertexShader.__proto__ || Object.getPrototypeOf(VertexShader)).call(this, gl, source, GL_VERTEX_SHADER));
  }

  // PRIVATE METHODS


  _createClass(VertexShader, [{
    key: '_createHandle',
    value: function _createHandle() {
      return this.gl.createShader(GL_VERTEX_SHADER);
    }
  }]);

  return VertexShader;
}(Shader);

var FragmentShader = /*#__PURE__*/exports.FragmentShader = function (_Shader2) {
  _inherits(FragmentShader, _Shader2);

  function FragmentShader(gl, source) {
    _classCallCheck(this, FragmentShader);

    return _possibleConstructorReturn(this, (FragmentShader.__proto__ || Object.getPrototypeOf(FragmentShader)).call(this, gl, source, GL_FRAGMENT_SHADER));
  }

  // PRIVATE METHODS


  _createClass(FragmentShader, [{
    key: '_createHandle',
    value: function _createHandle() {
      return this.gl.createShader(GL_FRAGMENT_SHADER);
    }
  }]);

  return FragmentShader;
}(Shader);
//# sourceMappingURL=shader.js.map