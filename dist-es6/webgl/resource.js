var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import luma from '../init';
import { assertWebGLContext, isWebGL2 } from './context';
import { glGet, glKey } from './gl-constants';
import { uid } from '../utils';
import assert from 'assert';
import { polyfillContext } from '../webgl-utils';

var ERR_RESOURCE_METHOD_UNDEFINED = 'Resource subclass must define virtual methods';

// TODO - Handle context loss
// function glGetContextLossCount(gl) {
//   return (gl.luma && gl.luma.glCount) || 0;
// }

var Resource = /*#__PURE__*/function () {
  function Resource(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Resource);

    assertWebGLContext(gl);

    var id = opts.id,
        _opts$userData = opts.userData,
        userData = _opts$userData === undefined ? {} : _opts$userData;

    this.gl = gl;
    this.ext = polyfillContext(gl);
    this.id = id || uid(this.constructor.name);
    this.userData = userData;
    this.opts = opts;

    // Set the handle
    // If handle was provided, use it, otherwise create a new handle

    // TODO - Stores the handle with context loss information
    // this.glCount = glGetContextLossCount(this.gl);

    // Default VertexArray needs to be created with null handle, so compare against undefined
    this._handle = opts.handle;
    if (this._handle === undefined) {
      this._handle = this._createHandle();
    }

    this._addStats();
  }

  _createClass(Resource, [{
    key: 'toString',
    value: function toString() {
      return this.constructor.name + '(' + this.id + ')';
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$deleteChildren = _ref.deleteChildren,
          deleteChildren = _ref$deleteChildren === undefined ? false : _ref$deleteChildren;

      // Delete this object, and get refs to any children
      var children = this._handle && this._deleteHandle(this._handle);
      this._handle = null;

      // Optionally, recursively delete the children
      if (children && deleteChildren) {
        children.filter(Boolean).forEach(function (child) {
          child.delete();
        });
      }

      return this;
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      this.bind(null);
    }

    /**
     * Query a Resource parameter
     *
     * @param {GLenum} pname
     * @return {GLint|GLfloat|GLenum} param
     */

  }, {
    key: 'getParameter',
    value: function getParameter(pname) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      pname = glGet(pname);
      assert(pname);

      var parameters = this.constructor.PARAMETERS || {};

      // Use parameter definitions to handle unsupported parameters
      var parameter = parameters[pname];
      if (parameter) {
        var isWebgl2 = isWebGL2(this.gl);

        // Check if we can query for this parameter
        var parameterAvailable = (!('webgl2' in parameter) || isWebgl2) && (!('extension' in parameter) || this.gl.getExtension(parameter.extension));

        if (!parameterAvailable) {
          var webgl1Default = parameter.webgl1;
          var webgl2Default = 'webgl2' in parameter ? parameter.webgl2 : parameter.webgl1;
          var defaultValue = isWebgl2 ? webgl2Default : webgl1Default;
          return defaultValue;
        }
      }

      // If unknown parameter - Could be a valid parameter not covered by PARAMS
      // Attempt to query for it and let WebGL report errors
      return this._getParameter(pname, opts);
    }

    // Many resources support a getParameter call -
    // getParameters will get all parameters - slow but useful for debugging

  }, {
    key: 'getParameters',
    value: function getParameters() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _ref2 = {},
          parameters = _ref2.parameters,
          keys = _ref2.keys;

      // Get parameter definitions for this Resource

      var PARAMETERS = this.constructor.PARAMETERS || {};

      var isWebgl2 = isWebGL2(this.gl);

      var values = {};

      // Query all parameters if no list provided
      var parameterKeys = parameters || Object.keys(PARAMETERS);

      // WEBGL limits
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = parameterKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pname = _step.value;

          var parameter = PARAMETERS[pname];

          // Check if this parameter is available on this platform
          var parameterAvailable = parameter && (!('webgl2' in parameter) || isWebgl2) && (!('extension' in parameter) || this.gl.getExtension(parameter.extension));

          if (parameterAvailable) {
            var key = keys ? glKey(pname) : pname;
            values[key] = this.getParameter(pname, opts);
            if (keys && parameter.type === 'GLenum') {
              values[key] = glKey(values[key]);
            }
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

      return values;
    }

    /**
     * Update a Resource setting
     *
     * @todo - cache parameter to avoid issuing WebGL calls?
     *
     * @param {GLenum} pname - parameter (GL constant, value or key)
     * @param {GLint|GLfloat|GLenum} value
     * @return {Resource} returns self to enable chaining
     */

  }, {
    key: 'setParameter',
    value: function setParameter(pname, value) {
      pname = glGet(pname);
      assert(pname);

      var parameters = this.constructor.PARAMETERS || {};

      var parameter = parameters[pname];
      if (parameter) {
        var isWebgl2 = isWebGL2(this.gl);

        // Check if this parameter is available on this platform
        var parameterAvailable = (!('webgl2' in parameter) || isWebgl2) && (!('extension' in parameter) || this.gl.getExtension(parameter.extension));

        if (!parameterAvailable) {
          throw new Error('Parameter not available on this platform');
        }

        // Handle string keys
        if (parameter.type === 'GLenum') {
          value = glGet(value);
        }
      }

      // If unknown parameter - Could be a valid parameter not covered by PARAMS
      // attempt to set it and let WebGL report errors
      this._setParameter(pname, value);
      return this;
    }

    /*
     * Batch update resource parameters
     * Assumes the subclass supports a setParameter call
     */

  }, {
    key: 'setParameters',
    value: function setParameters(parameters) {
      for (var pname in parameters) {
        this.setParameter(pname, parameters[pname]);
      }
      return this;
    }

    // PUBLIC VIRTUAL METHODS

  }, {
    key: 'initialize',
    value: function initialize(opts) {}

    // PROTECTED METHODS - These must be overridden by subclass

  }, {
    key: '_createHandle',
    value: function _createHandle() {
      throw new Error(ERR_RESOURCE_METHOD_UNDEFINED);
    }
  }, {
    key: '_deleteHandle',
    value: function _deleteHandle() {
      throw new Error(ERR_RESOURCE_METHOD_UNDEFINED);
    }
  }, {
    key: '_getOptsFromHandle',
    value: function _getOptsFromHandle() {
      throw new Error(ERR_RESOURCE_METHOD_UNDEFINED);
    }
  }, {
    key: '_getParameter',
    value: function _getParameter(pname, opts) {
      throw new Error(ERR_RESOURCE_METHOD_UNDEFINED);
    }

    /**
     * @param {GLenum} pname
     * @param {GLint|GLfloat|GLenum} param
     * @return {Sampler} returns self to enable chaining
     */

  }, {
    key: '_setParameter',
    value: function _setParameter(pname, value) {
      throw new Error(ERR_RESOURCE_METHOD_UNDEFINED);
    }

    // PRIVATE METHODS

  }, {
    key: '_context',
    value: function _context() {
      this.gl.luma = this.gl.luma || {};
      return this.gl.luma;
    }
  }, {
    key: '_addStats',
    value: function _addStats() {
      var name = this.constructor.name;

      var stats = luma.stats;

      stats.resourceCount = stats.resourceCount || 0;
      stats.resourceMap = stats.resourceMap || {};

      // Resource creation stats
      stats.resourceCount++;
      stats.resourceMap[name] = stats.resourceMap[name] || { count: 0 };
      stats.resourceMap[name].count++;
    }
  }, {
    key: 'handle',
    get: function get() {
      // TODO - Add context loss handling
      // Will regenerate and reinitialize the handle if necessary
      // const glCount = glGetContextLossCount(this.gl);
      // if (this.glCount !== glCount) {
      //   this._handle = this._createHandle(this.opts);
      //   this._glCount = glCount;
      //   // Reinitialize object
      //   this.initialize(this.opts);
      // }
      return this._handle;
    }
  }]);

  return Resource;
}();

export default Resource;
//# sourceMappingURL=resource.js.map