// GL Constants
var GL_BYTE = 0x1400;
var GL_UNSIGNED_BYTE = 0x1401;
var GL_SHORT = 0x1402;
var GL_UNSIGNED_SHORT = 0x1403;
var GL_INT = 0x1404;
var GL_UNSIGNED_INT = 0x1405;
var GL_FLOAT = 0x1406;
var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;

var ERR_TYPE_DEDUCTION = 'Failed to deduce GL constant from typed array';

// Converts TYPED ARRAYS to corresponding GL constant
// Used to auto deduce gl parameter types
export function getGLTypeFromTypedArray(arrayOrType) {
  // If typed array, look up constructor
  var type = ArrayBuffer.isView(arrayOrType) ? arrayOrType.constructor : arrayOrType;
  switch (type) {
    case Float32Array:
      return GL_FLOAT;
    case Uint16Array:
      return GL_UNSIGNED_SHORT;
    case Uint32Array:
      return GL_UNSIGNED_INT;
    case Uint8Array:
      return GL_UNSIGNED_BYTE;
    case Uint8ClampedArray:
      return GL_UNSIGNED_BYTE;
    case Int8Array:
      return GL_BYTE;
    case Int16Array:
      return GL_SHORT;
    case Int32Array:
      return GL_INT;
    default:
      throw new Error(ERR_TYPE_DEDUCTION);
  }
}

// Converts GL constant to corresponding TYPED ARRAY
// Used to auto deduce gl parameter types

/* eslint-disable complexity */
export function getTypedArrayFromGLType(glType) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$clamped = _ref.clamped,
      clamped = _ref$clamped === undefined ? true : _ref$clamped;

  // Sorted in some order of likelihood to reduce amount of comparisons
  switch (glType) {
    case GL_FLOAT:
      return Float32Array;
    case GL_UNSIGNED_SHORT:
    case GL_UNSIGNED_SHORT_5_6_5:
    case GL_UNSIGNED_SHORT_4_4_4_4:
    case GL_UNSIGNED_SHORT_5_5_5_1:
      return Uint16Array;
    case GL_UNSIGNED_INT:
      return Uint32Array;
    case GL_UNSIGNED_BYTE:
      return clamped ? Uint8ClampedArray : Uint8Array;
    case GL_BYTE:
      return Int8Array;
    case GL_SHORT:
      return Int16Array;
    case GL_INT:
      return Int32Array;
    default:
      throw new Error('Failed to deduce typed array type from GL constant');
  }
}
/* eslint-enable complexity */

// Flip rows (can be used on arrays returned from `Framebuffer.readPixels`)
// https://stackoverflow.com/questions/41969562/
// how-can-i-flip-the-result-of-webglrenderingcontext-readpixels
export function flipRows(_ref2) {
  var data = _ref2.data,
      width = _ref2.width,
      height = _ref2.height,
      _ref2$bytesPerPixel = _ref2.bytesPerPixel,
      bytesPerPixel = _ref2$bytesPerPixel === undefined ? 4 : _ref2$bytesPerPixel,
      temp = _ref2.temp;

  var bytesPerRow = width * bytesPerPixel;

  // make a temp buffer to hold one row
  temp = temp || new Uint8Array(bytesPerRow);
  for (var y = 0; y < height / 2; ++y) {
    var topOffset = y * bytesPerRow;
    var bottomOffset = (height - y - 1) * bytesPerRow;
    // make copy of a row on the top half
    temp.set(data.subarray(topOffset, topOffset + bytesPerRow));
    // copy a row from the bottom half to the top
    data.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
    // copy the copy of the top half row to the bottom half
    data.set(temp, bottomOffset);
  }
}

export function scalePixels(_ref3) {
  var data = _ref3.data,
      width = _ref3.width,
      height = _ref3.height;

  var newWidth = Math.round(width / 2);
  var newHeight = Math.round(height / 2);
  var newData = new Uint8Array(newWidth * newHeight * 4);
  for (var y = 0; y < newHeight; y++) {
    for (var x = 0; x < newWidth; x++) {
      for (var c = 0; c < 4; c++) {
        newData[(y * newWidth + x) * 4 + c] = data[(y * 2 * width + x * 2) * 4 + c];
      }
    }
  }
  return { data: newData, width: newWidth, height: newHeight };
}
//# sourceMappingURL=typed-array-utils.js.map