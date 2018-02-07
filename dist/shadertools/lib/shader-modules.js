'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerShaderModules = registerShaderModules;
exports.setDefaultShaderModules = setDefaultShaderModules;
exports.getShaderModule = getShaderModule;
exports.resolveModules = resolveModules;
exports.getShaderDependencies = getShaderDependencies;
exports.getDependencyGraph = getDependencyGraph;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shaderModules = {};
var defaultShaderModules = [];

/**
 * Registers an array of shader modules
 * @param {Object[]} shaderModuleList - Array of shader modules
 */
function registerShaderModules(shaderModuleList) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$ignoreMultipleRe = _ref.ignoreMultipleRegistrations,
      ignoreMultipleRegistrations = _ref$ignoreMultipleRe === undefined ? false : _ref$ignoreMultipleRe;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = shaderModuleList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var shaderModule = _step.value;

      registerShaderModule(shaderModule, { ignoreMultipleRegistrations: ignoreMultipleRegistrations });
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

/**
 * Registers an array of default shader modules. These will be concatenated
 * automatically at the end of any shader module list passed to
 * `assembleShaders` (plus `resolveModules` and `getShaderDependencies`)
 * @param {Object[]} modules - Array of shader modules
 */
function setDefaultShaderModules(modules) {
  defaultShaderModules = modules;
}

// Looks up a moduleName among registered modules and returns definition.
// If "inline" module, returns it directly
function getShaderModule(moduleOrName) {
  // Check if "inline" module
  if (typeof moduleOrName !== 'string') {
    var _shaderModule = moduleOrName;
    (0, _assert2.default)(typeof _shaderModule.name === 'string');
    registerShaderModule(_shaderModule, { ignoreMultipleRegistrations: true });
    return _shaderModule;
  }

  // Look up module
  var shaderModule = shaderModules[moduleOrName];
  if (!shaderModule) {
    // console.log(`${moduleOrName} not in registered modules:`, shaderModules);
    (0, _assert2.default)(false, 'Unknown shader module ' + moduleOrName);
  }
  return shaderModule;
}

// registers any supplied modules and returns a list of module names
function resolveModules(modules) {
  var moduleNames = modules.map(function (module) {
    if (typeof module !== 'string') {
      registerShaderModules([module], { ignoreMultipleRegistrations: true });
      return module.name;
    }
    return module;
  });

  return getShaderDependencies(moduleNames);
}

/**
 * Takes a list of shader module names and returns a new list of
 * shader module names that includes all dependencies, sorted so
 * that modules that are dependencies of other modules come first.
 *
 * If the shader glsl code from the returned modules is concatenated
 * in the reverse order, it is guaranteed that all functions be resolved and
 * that all function and variable definitions come before use.
 *
 * @param {String[]} modules - Array of modules (inline modules or module names)
 * @return {String[]} - Array of modules
 */
function getShaderDependencies(modules) {
  modules = modules.concat(defaultShaderModules);

  var result = {};
  getDependencyGraph({
    modules: modules,
    level: 0,
    result: result
  });

  // Return a reverse sort so that dependencies come before the modules that use them
  return Object.keys(result).sort(function (a, b) {
    return result[b] - result[a];
  });
}

/**
 * Recursively checks module dpendencies to calculate dependency
 * level of each module.
 *
 * @param {String[]} modules - Array of modules
 * @param {Number} level - Current level
 * @return {result} - Map of module name to its level
 */
// Adds another level of dependencies to the result map
function getDependencyGraph(_ref2) {
  var modules = _ref2.modules,
      level = _ref2.level,
      result = _ref2.result;

  if (level >= 5) {
    throw new Error('Possible loop in shader dependency graph');
  }

  // Update level on all current modules
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = modules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var moduleOrName = _step2.value;

      var shaderModule = getShaderModule(moduleOrName);
      if (result[shaderModule.name] === undefined || result[shaderModule.name] < level) {
        result[shaderModule.name] = level;
      }
    }

    // Recurse
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

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = modules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _moduleOrName = _step3.value;

      var _shaderModule2 = getShaderModule(_moduleOrName);

      if (_shaderModule2.dependencies) {
        getDependencyGraph({
          modules: _shaderModule2.dependencies,
          level: level + 1,
          result: result
        });
      }
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

// PRIVATE API

function parseDeprecationDefinitions() {
  var deprecations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  deprecations.forEach(function (def) {
    switch (def.type) {
      case 'function':
        def.regex = new RegExp('\\b' + def.old + '\\(');
        break;
      default:
        def.regex = new RegExp(def.type + ' ' + def.old + ';');
    }
  });

  return deprecations;
}

function registerShaderModule(shaderModule, _ref3) {
  var _ref3$ignoreMultipleR = _ref3.ignoreMultipleRegistrations,
      ignoreMultipleRegistrations = _ref3$ignoreMultipleR === undefined ? false : _ref3$ignoreMultipleR;

  (0, _assert2.default)(shaderModule.name, 'shader module has no name');
  if (!ignoreMultipleRegistrations && shaderModules[shaderModule.name]) {
    // TODO - instead verify that definition is not changing...
    throw new Error('shader module ' + shaderModule.name + ' already registered');
  }
  shaderModules[shaderModule.name] = shaderModule;
  shaderModule.dependencies = shaderModule.dependencies || [];
  shaderModule.deprecations = parseDeprecationDefinitions(shaderModule.deprecations);
}
//# sourceMappingURL=shader-modules.js.map