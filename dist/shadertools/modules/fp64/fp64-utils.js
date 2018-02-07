"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fp64ify = fp64ify;
function fp64ify(a) {
  var hiPart = Math.fround(a);
  var loPart = a - hiPart;
  return [hiPart, loPart];
}
//# sourceMappingURL=fp64-utils.js.map