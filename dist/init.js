'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.global = undefined;

var _isBrowser = require('./utils/is-browser');

var _globals = require('./utils/globals');

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Version detection using babel plugin
/* global __VERSION__ */
var VERSION = typeof '5.0.2' !== 'undefined' ? '5.0.2' : 'untranspiled source';

var STARTUP_MESSAGE = 'set luma.log.priority=1 (or higher) to trace rendering';
// Assign luma.log.priority in console to control logging: \
// 0: none, 1: minimal, 2: verbose, 3: attribute/uniforms, 4: gl logs
// luma.log.break[], set to gl funcs, luma.log.profile[] set to model names`;

if (_globals.global.luma && _globals.global.luma.VERSION !== VERSION) {
  throw new Error('luma.gl - multiple VERSIONs detected: ' + _globals.global.luma.VERSION + ' vs ' + VERSION);
}

if (!_globals.global.luma) {
  /* global console */
  /* eslint-disable no-console */
  if (_isBrowser.isBrowser) {
    console.log('luma.gl ' + VERSION + ' - ' + STARTUP_MESSAGE);
  }

  _globals.global.luma = _globals.global.luma || {
    VERSION: VERSION,
    version: VERSION,
    log: _log2.default,

    // A global stats object that various components can add information to
    // E.g. see webgl/resource.js
    stats: {},

    // Keep some luma globals in a sub-object
    // This allows us to dynamically detect if certain modules have been
    // included (such as IO and headless) and enable related functionality,
    // without unconditionally requiring and thus bundling big dependencies
    // into the app.
    globals: {
      headlessGL: null,
      headlessTypes: null,
      modules: {},
      nodeIO: {}
    }
  };
}

exports.global = _globals.global;
exports.default = _globals.global.luma;
//# sourceMappingURL=init.js.map