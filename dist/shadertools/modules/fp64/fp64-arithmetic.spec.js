'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _fp64TestUtils = require('./fp64-test-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Actual tests for different arithmetic functions

(0, _tapeCatch2.default)('fp64#sum_fp64', function (t) {
  (0, _fp64TestUtils.testcase)(_fp64TestUtils.gl, { glslFunc: 'sum_fp64', binary: true, op: function op(a, b) {
      return a + b;
    }, t: t });
});

(0, _tapeCatch2.default)('fp64#sub_fp64', function (t) {
  (0, _fp64TestUtils.testcase)(_fp64TestUtils.gl, { glslFunc: 'sub_fp64', binary: true, op: function op(a, b) {
      return a - b;
    }, t: t });
});

(0, _tapeCatch2.default)('fp64#mul_fp64', function (t) {
  (0, _fp64TestUtils.testcase)(_fp64TestUtils.gl, { glslFunc: 'mul_fp64', binary: true, op: function op(a, b) {
      return a * b;
    }, limit: 128, t: t });
});

(0, _tapeCatch2.default)('fp64#div_fp64', function (t) {
  (0, _fp64TestUtils.testcase)(_fp64TestUtils.gl, { glslFunc: 'div_fp64', binary: true, op: function op(a, b) {
      return a / b;
    }, limit: 128, t: t });
});

(0, _tapeCatch2.default)('fp64#sqrt_fp64', function (t) {
  (0, _fp64TestUtils.testcase)(_fp64TestUtils.gl, { glslFunc: 'sqrt_fp64', op: function op(a) {
      return Math.sqrt(a);
    }, limit: 128, t: t });
});
//# sourceMappingURL=fp64-arithmetic.spec.js.map