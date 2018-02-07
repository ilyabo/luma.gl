'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SHADER_TYPE, _MODULE_INJECTORS;

exports.assembleShaders = assembleShaders;

var _shaderModules = require('./shader-modules');

var _platformDefines = require('./platform-defines');

var _moduleInjectors = require('../modules/module-injectors');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VERTEX_SHADER = 'vs';
var FRAGMENT_SHADER = 'fs';

var SHADER_TYPE = (_SHADER_TYPE = {}, _defineProperty(_SHADER_TYPE, VERTEX_SHADER, 'vertex'), _defineProperty(_SHADER_TYPE, FRAGMENT_SHADER, 'fragment'), _SHADER_TYPE);

var MODULE_INJECTORS = (_MODULE_INJECTORS = {}, _defineProperty(_MODULE_INJECTORS, VERTEX_SHADER, _moduleInjectors.MODULE_INJECTORS_VS), _defineProperty(_MODULE_INJECTORS, FRAGMENT_SHADER, _moduleInjectors.MODULE_INJECTORS_FS), _MODULE_INJECTORS);

// Precision prologue to inject before functions are injected in shader
// TODO - extract any existing prologue in the fragment source and move it up...
var FRAGMENT_SHADER_PROLOGUE = '#ifdef GL_ES\nprecision highp float;\n#endif\n\n';

// Generate "glslify-compatible" SHADER_NAME defines
// These are understood by the GLSL error parsing function
// If id is provided and no SHADER_NAME constant is present in source, create one
function getShaderName(_ref) {
  var id = _ref.id,
      source = _ref.source,
      type = _ref.type;

  var injectShaderName = id && typeof id === 'string' && source.indexOf('SHADER_NAME') === -1;
  return injectShaderName ? '\n#define SHADER_NAME ' + id + '_' + SHADER_TYPE[type] + '\n\n' : '';
}

// Generates application defines from an object
function getApplicationDefines() {
  var defines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var count = 0;
  var sourceText = '';
  for (var define in defines) {
    if (count === 0) {
      sourceText += '\n// APPLICATION DEFINES\n';
    }
    count++;
    sourceText += '#define ' + define.toUpperCase() + ' ' + defines[define] + '\n';
  }
  if (count === 0) {
    sourceText += '\n';
  }
  return sourceText;
}

// Warn about deprecated uniforms or functions
function checkDeprecation(moduleName, shaderSource) {
  var shaderModule = (0, _shaderModules.getShaderModule)(moduleName);

  shaderModule.deprecations.forEach(function (def) {
    if (def.regex.test(shaderSource)) {
      if (def.deprecated) {
        _utils.log.deprecated(def.old, def.new);
      } else {
        _utils.log.removed(def.old, def.new);
      }
    }
  });
}

// Extracts the source code chunk for the specified shader type from the named shader module
function getModuleSource(moduleName, type) {
  var shaderModule = (0, _shaderModules.getShaderModule)(moduleName);
  var moduleSource = void 0;
  switch (type) {
    case VERTEX_SHADER:
      moduleSource = shaderModule.vs || shaderModule.vertexShader;
      break;
    case FRAGMENT_SHADER:
      moduleSource = shaderModule.fs || shaderModule.fragmentShader;
      break;
    default:
      (0, _assert2.default)(false);
  }

  if (typeof moduleSource !== 'string') {
    return '';
  }

  return '#define MODULE_' + moduleName.toUpperCase() + '\n' + moduleSource + '// END MODULE_' + moduleName + '\n\n';
}

// Pulls together complete source code for either a vertex or a fragment shader
// adding prologues, requested module chunks, and any final injections.
function assembleShader(gl, _ref2) {
  var id = _ref2.id,
      source = _ref2.source,
      type = _ref2.type,
      _ref2$modules = _ref2.modules,
      modules = _ref2$modules === undefined ? [] : _ref2$modules,
      _ref2$defines = _ref2.defines,
      defines = _ref2$defines === undefined ? {} : _ref2$defines;

  (0, _assert2.default)(typeof source === 'string', 'shader source must be a string');

  var sourceLines = source.split('\n');
  var versionLine = '';
  var coreSource = source;
  // Extract any version directive string from source.
  // TODO : keep all pre-processor statements at the begining of the shader.
  if (sourceLines[0].indexOf('#version ') === 0) {
    versionLine = sourceLines[0];
    coreSource = sourceLines.slice(1).join('\n');
  }

  // Add platform defines (use these to work around platform-specific bugs and limitations)
  // Add common defines (GLSL version compatibility, feature detection)
  // Add precision declaration for fragment shaders
  var assembledSource = getShaderName({ id: id, source: source, type: type }) + '\n' + (0, _platformDefines.getPlatformShaderDefines)(gl) + '\n' + (0, _platformDefines.getVersionDefines)(gl) + '\n' + getApplicationDefines(defines) + '\n' + (type === FRAGMENT_SHADER ? FRAGMENT_SHADER_PROLOGUE : '') + '\n';

  // Add source of dependent modules in resolved order
  var inject = false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = modules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var moduleName = _step.value;

      switch (moduleName) {
        case 'inject':
          inject = true;
          break;
        default:
          checkDeprecation(moduleName, coreSource);
          // Add the module source, and a #define that declares it presence
          assembledSource += getModuleSource(moduleName, type);
      }
    }

    // Add the version directive and actual source of this shader
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

  assembledSource = versionLine + assembledSource + coreSource;

  // Finally, if requested, insert an automatic module injector chunk
  if (inject) {
    assembledSource.replace('}\s*$', MODULE_INJECTORS);
  }

  return assembledSource;
}

// Returns a combined `getUniforms` covering the options for all the modules,
// the created function will pass on options to the inidividual `getUniforms`
// function of each shader module and combine the results into one object that
// can be passed to setUniforms.
function assembleGetUniforms(modules) {

  return function getUniforms(opts) {
    var uniforms = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = modules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var moduleName = _step2.value;

        var shaderModule = (0, _shaderModules.getShaderModule)(moduleName);
        var moduleUniforms = shaderModule.getUniforms ? shaderModule.getUniforms(opts) : {};
        Object.assign(uniforms, moduleUniforms);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return uniforms;
  };
}

// Returns a map with module names as keys, resolving to their module definitions
// The presence of a key indicates that the module is available in this program,
// whether directly included, or through a dependency of some other module
function assembleModuleMap(modules) {
  var result = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = modules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var moduleName = _step3.value;

      var shaderModule = (0, _shaderModules.getShaderModule)(moduleName);
      result[moduleName] = shaderModule;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return result;
}

/**
 * Apply set of modules
 */
function assembleShaders(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var vs = opts.vs,
      fs = opts.fs;

  var modules = (0, _shaderModules.resolveModules)(opts.modules || []);
  return {
    gl: gl,
    vs: assembleShader(gl, Object.assign({}, opts, { source: vs, type: VERTEX_SHADER, modules: modules })),
    fs: assembleShader(gl, Object.assign({}, opts, { source: fs, type: FRAGMENT_SHADER, modules: modules })),
    getUniforms: assembleGetUniforms(modules),
    modules: assembleModuleMap(modules)
  };
}
//# sourceMappingURL=assemble-shaders.js.map