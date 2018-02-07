var _GL_ERROR_MESSAGES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Helper definitions for validation of webgl parameters
/* eslint-disable no-inline-comments, max-len */

// Errors - Constants returned from getError().
var GL_NO_ERROR = 0; // Returned from getError.
var GL_INVALID_ENUM = 0x0500; //  Returned from getError.
var GL_INVALID_VALUE = 0x0501; //  Returned from getError.
var GL_INVALID_OPERATION = 0x0502; //  Returned from getError.
var GL_OUT_OF_MEMORY = 0x0505; //  Returned from getError.
var GL_CONTEXT_LOST_WEBGL = 0x9242; //  Returned from getError.
var GL_INVALID_FRAMEBUFFER_OPERATION = 0x0506;

// GL errors

var GL_ERROR_MESSAGES = (_GL_ERROR_MESSAGES = {}, _defineProperty(_GL_ERROR_MESSAGES, GL_CONTEXT_LOST_WEBGL, 'WebGL context lost'), _defineProperty(_GL_ERROR_MESSAGES, GL_INVALID_ENUM, 'WebGL invalid enumerated argument'), _defineProperty(_GL_ERROR_MESSAGES, GL_INVALID_VALUE, 'WebGL invalid value'), _defineProperty(_GL_ERROR_MESSAGES, GL_INVALID_OPERATION, 'WebGL invalid operation'), _defineProperty(_GL_ERROR_MESSAGES, GL_INVALID_FRAMEBUFFER_OPERATION, 'WebGL invalid framebuffer operation'), _defineProperty(_GL_ERROR_MESSAGES, GL_OUT_OF_MEMORY, 'WebGL out of memory'), _GL_ERROR_MESSAGES);

function glGetErrorMessage(gl, glError) {
  return GL_ERROR_MESSAGES[glError] || 'WebGL unknown error ' + glError;
}

// Returns an Error representing the Latest webGl error or null
export function glGetError(gl) {
  // Loop to ensure all errors are cleared
  var errorStack = [];
  var glError = gl.getError();
  while (glError !== GL_NO_ERROR) {
    errorStack.push(glGetErrorMessage(gl, glError));
    glError = gl.getError();
  }
  return errorStack.length ? new Error(errorStack.join('\n')) : null;
}

export function glCheckError(gl) {
  if (gl.debug) {
    var error = glGetError(gl);
    if (error) {
      throw error;
    }
  }
}
//# sourceMappingURL=get-error.js.map