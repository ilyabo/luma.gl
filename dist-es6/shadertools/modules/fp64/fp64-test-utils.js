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

// Special utility functions for df64 tests

/* eslint-disable camelcase, prefer-template, max-len */
/* global window, document, */

import { Buffer, Program, assembleShaders, registerShaderModules, fp64 } from 'luma.gl';
import { initializeGL, initializeTexTarget, render, getGPUOutput } from '../../test/gpu-test-utils';

var BUFFER_DATA = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);

function fp64ify(a) {
  var hi = Math.fround(a);
  var lo = a - Math.fround(a);
  return new Float32Array([hi, lo]);
}

function getFloat64() {
  var upper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;

  return Math.random() * Math.pow(2.0, (Math.random() - 0.5) * upper);
}

export function getRelativeError64(result, reference) {
  var reference64 = reference[0] + reference[1];
  var result64 = result[0] + result[1];
  return Math.abs((reference64 - result64) / reference64);
}

export function getRelativeError(result, reference) {
  return Math.abs((reference - result) / reference);
}

function getBinaryShader(operation) {
  return 'attribute vec3 positions;\nuniform vec2 a;\nuniform vec2 b;\nvarying vec4 vColor;\nvoid main(void) {\n  gl_Position = vec4(positions, 1.0);\n  vec2 result = ' + operation + '(a, b);\n  vColor = vec4(result.x, result.y, 0.0, 1.0);\n}\n';
}

function getUnaryShader(operation) {
  return 'attribute vec3 positions;\nuniform vec2 a;\nvarying vec4 vColor;\nvoid main(void) {\n  gl_Position = vec4(positions, 1.0);\n  vec2 result = ' + operation + '(a);\n  vColor = vec4(result.x, result.y, 0.0, 1.0);\n}\n';
}

var FS_RENDER_VCOLOR = '#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec4 vColor;\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n';

function setupFloatTest(gl, _ref) {
  var glslFunc = _ref.glslFunc,
      _ref$binary = _ref.binary,
      binary = _ref$binary === undefined ? false : _ref$binary,
      _ref$limit = _ref.limit,
      limit = _ref$limit === undefined ? 256 : _ref$limit,
      op = _ref.op;

  var a = getFloat64(limit);
  var b = getFloat64(limit);
  var expected = op(a, b);

  var a_fp64 = fp64ify(a);
  var b_fp64 = fp64ify(b);
  var expected_fp64 = fp64ify(expected);

  var vs = binary ? getBinaryShader(glslFunc) : getUnaryShader(glslFunc);

  var program = new Program(gl, assembleShaders(gl, {
    vs: vs,
    fs: FS_RENDER_VCOLOR,
    modules: ['fp64']
  }));

  program.use().setBuffers({
    positions: new Buffer(gl, { target: gl.ARRAY_BUFFER, data: BUFFER_DATA, size: 2 })
  }).setUniforms({
    a: a_fp64,
    b: b_fp64,
    ONE: 1.0
  });

  return { a: a, b: b, expected: expected, a_fp64: a_fp64, b_fp64: b_fp64, expected_fp64: expected_fp64, program: program };
}

var ITERATIONS = 10;
var EPSILON = 1e-14;

export function testcase(gl, _ref2) {
  var glslFunc = _ref2.glslFunc,
      binary = _ref2.binary,
      op = _ref2.op,
      _ref2$limit = _ref2.limit,
      limit = _ref2$limit === undefined ? 256 : _ref2$limit,
      t = _ref2.t;

  for (var idx0 = 0; idx0 < ITERATIONS; idx0++) {
    var _setupFloatTest = setupFloatTest(gl, {
      glslFunc: glslFunc, binary: binary, op: op, limit: limit
    }),
        a = _setupFloatTest.a,
        b = _setupFloatTest.b,
        a_fp64 = _setupFloatTest.a_fp64,
        b_fp64 = _setupFloatTest.b_fp64,
        expected_fp64 = _setupFloatTest.expected_fp64;

    render(gl);
    var gpu_result = getGPUOutput(gl);
    var relativeError = getRelativeError64(gpu_result, expected_fp64);
    var args = binary ? '(' + a.toPrecision(2) + ', ' + b.toPrecision(2) + ')' : '(' + a.toPrecision(2) + ')';
    var message = '' + glslFunc + args + ': error=' + relativeError + ', within ' + EPSILON;
    t.ok(relativeError < EPSILON, message);
    if (relativeError >= EPSILON) {
      t.comment(' (tested ' + a_fp64.toString() + ', ' + b_fp64.toString() + ')');
    }
  }
  t.end();
}

// Main entrance
var canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;

export var gl = initializeGL(canvas);
initializeTexTarget(gl);
registerShaderModules([fp64]);

window.onload = function () {
  document.body.appendChild(canvas);
};
//# sourceMappingURL=fp64-test-utils.js.map