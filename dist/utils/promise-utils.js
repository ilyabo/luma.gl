"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
/**
 * Converts a function that accepts a node style (err, result) callback
 * as the last argument into a function that takes the same arguments
 * and returns a promise that resolves or rejects with the values provided
 * by the original callback
 * @param {Function} func - function to wrap
 * @return {Function} promisified function
 */
/* eslint-disable no-try-catch */
function promisify(func) {
  return function promisifiedFunction() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      function callback(error, data) {
        try {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        } catch (e) {
          reject(e);
        }
      }
      func.apply(undefined, args.concat([callback]));
    });
  };
}
/* eslint-enable no-try-catch */
//# sourceMappingURL=promise-utils.js.map