'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseGLSLCompilerError = parseGLSLCompilerError;
exports.default = formatGLSLCompilerError;

var _getShaderName = require('./get-shader-name');

var _getShaderName2 = _interopRequireDefault(_getShaderName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parse a GLSL compiler error log into a string showing the source code around each error.
 * Based on https://github.com/wwwtyro/gl-format-compiler-error (public domain)
 */
/* eslint-disable no-continue, max-statements */
function parseGLSLCompilerError(errLog, src, shaderType) {
  var errorStrings = errLog.split(/\r?\n/);
  var errors = {};
  var warnings = {};

  var name = (0, _getShaderName2.default)(src) || '(unnamed)';
  var shaderName = (0, _getShaderName.getShaderTypeName)(shaderType) + ' shader ' + name;

  // Parse the error - note: browser and driver dependent
  for (var i = 0; i < errorStrings.length; i++) {
    var errorString = errorStrings[i];
    if (errorString.length <= 1) {
      continue;
    }
    var segments = errorString.split(':');
    var type = segments[0];
    var line = parseInt(segments[2], 10);
    if (isNaN(line)) {
      throw new Error('GLSL compilation error in ' + shaderName + ': ' + errLog);
    }
    if (type !== 'WARNING') {
      errors[line] = errorString;
    } else {
      warnings[line] = errorString;
    }
  }

  // Format the error inline with the code
  var lines = addLineNumbers(src);

  return {
    shaderName: shaderName,
    errors: formatErrors(errors, lines),
    warnings: formatErrors(warnings, lines)
  };
}

// Formats GLSL compiler error log into single string
// TODO - formatGLSLCompilerError should not depend on this
function formatGLSLCompilerError(errLog, src, shaderType) {
  var _parseGLSLCompilerErr = parseGLSLCompilerError(errLog, src, shaderType),
      shaderName = _parseGLSLCompilerErr.shaderName,
      errors = _parseGLSLCompilerErr.errors,
      warnings = _parseGLSLCompilerErr.warnings;

  return 'GLSL compilation error in ' + shaderName + '\n\n' + errors + '\n' + warnings;
}

// helper function, outputs annotated errors or warnings
function formatErrors(errors, lines) {
  var message = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (!errors[i + 3] && !errors[i + 2] && !errors[i + 1]) {
      continue;
    }
    message += line + '\n';
    if (errors[i + 1]) {
      var error = errors[i + 1];
      var segments = error.split(':', 3);
      var type = segments[0];
      var column = parseInt(segments[1], 10) || 0;
      var err = error.substring(segments.join(':').length + 1).trim();
      message += padLeft('^^^ ' + type + ': ' + err + '\n\n', column);
    }
  }
  return message;
}

/**
 * Prepends line numbers to each line of a string.
 * The line numbers will be left-padded with spaces to ensure an
 * aligned layout when rendered using monospace fonts.
 * @param {String} string - multi-line string to add line numbers to
 * @param {Number} start=1 - number of spaces to add
 * @param {String} delim =': ' - injected between line number and original line
 * @return {String[]} strings - array of string, one per line, with line numbers added
 */
function addLineNumbers(string) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var delim = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ': ';

  var lines = string.split(/\r?\n/);
  var maxDigits = String(lines.length + start - 1).length;
  return lines.map(function (line, i) {
    var lineNumber = i + start;
    var digits = String(lineNumber).length;
    var prefix = padLeft(lineNumber, maxDigits - digits);
    return prefix + delim + line;
  });
}

/**
 * Pads a string with a number of spaces (space characters) to the left
 * @param {String} string - string to pad
 * @param {Number} digits - number of spaces to add
 * @return {String} string - The padded string
 */
function padLeft(string, digits) {
  var result = '';
  for (var i = 0; i < digits; ++i) {
    result += ' ';
  }
  return '' + result + string;
}
//# sourceMappingURL=format-glsl-error.js.map