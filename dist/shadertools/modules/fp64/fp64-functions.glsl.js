"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

exports.default = "const vec2 E_FP64 = vec2(2.7182817459106445e+00, 8.254840366817007e-08);\nconst vec2 LOG2_FP64 = vec2(0.6931471824645996e+00, -1.9046542121259336e-09);\nconst vec2 PI_FP64 = vec2(3.1415927410125732, -8.742278012618954e-8);\nconst vec2 TWO_PI_FP64 = vec2(6.2831854820251465, -1.7484556025237907e-7);\nconst vec2 PI_2_FP64 = vec2(1.5707963705062866, -4.371139006309477e-8);\nconst vec2 PI_4_FP64 = vec2(0.7853981852531433, -2.1855695031547384e-8);\nconst vec2 PI_16_FP64 = vec2(0.19634954631328583, -5.463923757886846e-9);\nconst vec2 PI_16_2_FP64 = vec2(0.39269909262657166, -1.0927847515773692e-8);\nconst vec2 PI_16_3_FP64 = vec2(0.5890486240386963, -1.4906100798128818e-9);\nconst vec2 PI_180_FP64 = vec2(0.01745329238474369, 1.3519960498364902e-10);\n\nconst vec2 SIN_TABLE_0_FP64 = vec2(0.19509032368659973, -1.6704714833615242e-9);\nconst vec2 SIN_TABLE_1_FP64 = vec2(0.3826834261417389, 6.22335089017767e-9);\nconst vec2 SIN_TABLE_2_FP64 = vec2(0.5555702447891235, -1.1769521357507529e-8);\nconst vec2 SIN_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617041793133e-8);\n\nconst vec2 COS_TABLE_0_FP64 = vec2(0.9807852506637573, 2.9739473106360492e-8);\nconst vec2 COS_TABLE_1_FP64 = vec2(0.9238795042037964, 2.8307490351764386e-8);\nconst vec2 COS_TABLE_2_FP64 = vec2(0.8314695954322815, 1.6870263741530778e-8);\nconst vec2 COS_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617152815436e-8);\n\nconst vec2 INVERSE_FACTORIAL_3_FP64 = vec2(1.666666716337204e-01, -4.967053879312289e-09); // 1/3!\nconst vec2 INVERSE_FACTORIAL_4_FP64 = vec2(4.16666679084301e-02, -1.2417634698280722e-09); // 1/4!\nconst vec2 INVERSE_FACTORIAL_5_FP64 = vec2(8.333333767950535e-03, -4.34617203337595e-10); // 1/5!\nconst vec2 INVERSE_FACTORIAL_6_FP64 = vec2(1.3888889225199819e-03, -3.3631094437103215e-11); // 1/6!\nconst vec2 INVERSE_FACTORIAL_7_FP64 = vec2(1.9841270113829523e-04,  -2.725596874933456e-12); // 1/7!\nconst vec2 INVERSE_FACTORIAL_8_FP64 = vec2(2.4801587642286904e-05, -3.406996025904184e-13); // 1/8!\nconst vec2 INVERSE_FACTORIAL_9_FP64 = vec2(2.75573188446287533e-06, 3.7935713937038186e-14); // 1/9!\nconst vec2 INVERSE_FACTORIAL_10_FP64 = vec2(2.755731998149713e-07, -7.575112367869873e-15); // 1/10!\n\nfloat nint(float d) {\n    if (d == floor(d)) return d;\n    return floor(d + 0.5);\n}\n\nvec2 nint_fp64(vec2 a) {\n    float hi = nint(a.x);\n    float lo;\n    vec2 tmp;\n    if (hi == a.x) {\n        lo = nint(a.y);\n        tmp = quickTwoSum(hi, lo);\n    } else {\n        lo = 0.0;\n        if (abs(hi - a.x) == 0.5 && a.y < 0.0) {\n            hi -= 1.0;\n        }\n        tmp = vec2(hi, lo);\n    }\n    return tmp;\n}\n\n/* k_power controls how much range reduction we would like to have\nRange reduction uses the following method:\nassume a = k_power * r + m * log(2), k and m being integers.\nSet k_power = 4 (we can choose other k to trade accuracy with performance.\nwe only need to calculate exp(r) and using exp(a) = 2^m * exp(r)^k_power;\n*/\n\nvec2 exp_fp64(vec2 a) {\n  // We need to make sure these two numbers match\n  // as bit-wise shift is not available in GLSL 1.0\n  const int k_power = 4;\n  const float k = 16.0;\n\n  const float inv_k = 1.0 / k;\n\n  if (a.x <= -88.0) return vec2(0.0, 0.0);\n  if (a.x >= 88.0) return vec2(1.0 / 0.0, 1.0 / 0.0);\n  if (a.x == 0.0 && a.y == 0.0) return vec2(1.0, 0.0);\n  if (a.x == 1.0 && a.y == 0.0) return E_FP64;\n\n  float m = floor(a.x / LOG2_FP64.x + 0.5);\n  vec2 r = sub_fp64(a, mul_fp64(LOG2_FP64, vec2(m, 0.0))) * inv_k;\n  vec2 s, t, p;\n\n  p = mul_fp64(r, r);\n  s = sum_fp64(r, p * 0.5);\n  p = mul_fp64(p, r);\n  t = mul_fp64(p, INVERSE_FACTORIAL_3_FP64);\n\n  s = sum_fp64(s, t);\n  p = mul_fp64(p, r);\n  t = mul_fp64(p, INVERSE_FACTORIAL_4_FP64);\n\n  s = sum_fp64(s, t);\n  p = mul_fp64(p, r);\n  t = mul_fp64(p, INVERSE_FACTORIAL_5_FP64);\n\n  // s = sum_fp64(s, t);\n  // p = mul_fp64(p, r);\n  // t = mul_fp64(p, INVERSE_FACTORIAL_6_FP64);\n\n  // s = sum_fp64(s, t);\n  // p = mul_fp64(p, r);\n  // t = mul_fp64(p, INVERSE_FACTORIAL_7_FP64);\n\n  s = sum_fp64(s, t);\n\n\n  // At this point, s = exp(r) - 1; but after following 4 recursions, we will get exp(r) ^ 512 - 1.\n  for (int i = 0; i < k_power; i++) {\n    s = sum_fp64(s * 2.0, mul_fp64(s, s));\n  }\n\n#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)\n  s = sum_fp64(s, vec2(ONE, 0.0));\n#else\n  s = sum_fp64(s, vec2(1.0, 0.0));\n#endif\n\n  return s * pow(2.0, m);\n//   return r;\n}\n\nvec2 log_fp64(vec2 a)\n{\n  if (a.x == 1.0 && a.y == 0.0) return vec2(0.0, 0.0);\n  if (a.x <= 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);\n  vec2 x = vec2(log(a.x), 0.0);\n  vec2 s;\n#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)\n  s = vec2(ONE, 0.0);\n#else\n  s = vec2(1.0, 0.0);\n#endif\n\n  x = sub_fp64(sum_fp64(x, mul_fp64(a, exp_fp64(-x))), s);\n  return x;\n}\n\nvec2 sin_taylor_fp64(vec2 a) {\n  vec2 r, s, t, x;\n\n  if (a.x == 0.0 && a.y == 0.0) {\n    return vec2(0.0, 0.0);\n  }\n\n  x = -mul_fp64(a, a);\n  s = a;\n  r = a;\n\n  r = mul_fp64(r, x);\n  t = mul_fp64(r, INVERSE_FACTORIAL_3_FP64);\n  s = sum_fp64(s, t);\n\n  r = mul_fp64(r, x);\n  t = mul_fp64(r, INVERSE_FACTORIAL_5_FP64);\n  s = sum_fp64(s, t);\n\n  /* keep the following commented code in case we need them\n  for extra accuracy from the Taylor expansion*/\n\n  // r = mul_fp64(r, x);\n  // t = mul_fp64(r, INVERSE_FACTORIAL_7_FP64);\n  // s = sum_fp64(s, t);\n\n  // r = mul_fp64(r, x);\n  // t = mul_fp64(r, INVERSE_FACTORIAL_9_FP64);\n  // s = sum_fp64(s, t);\n\n  return s;\n}\n\nvec2 cos_taylor_fp64(vec2 a) {\n  vec2 r, s, t, x;\n\n  if (a.x == 0.0 && a.y == 0.0) {\n    return vec2(1.0, 0.0);\n  }\n\n  x = -mul_fp64(a, a);\n  r = x;\n  s = sum_fp64(vec2(1.0, 0.0), r * 0.5);\n\n  r = mul_fp64(r, x);\n  t = mul_fp64(r, INVERSE_FACTORIAL_4_FP64);\n  s = sum_fp64(s, t);\n\n  r = mul_fp64(r, x);\n  t = mul_fp64(r, INVERSE_FACTORIAL_6_FP64);\n  s = sum_fp64(s, t);\n\n  /* keep the following commented code in case we need them\n  for extra accuracy from the Taylor expansion*/\n\n  // r = mul_fp64(r, x);\n  // t = mul_fp64(r, INVERSE_FACTORIAL_8_FP64);\n  // s = sum_fp64(s, t);\n\n  // r = mul_fp64(r, x);\n  // t = mul_fp64(r, INVERSE_FACTORIAL_10_FP64);\n  // s = sum_fp64(s, t);\n\n  return s;\n}\n\nvoid sincos_taylor_fp64(vec2 a, out vec2 sin_t, out vec2 cos_t) {\n  if (a.x == 0.0 && a.y == 0.0) {\n    sin_t = vec2(0.0, 0.0);\n    cos_t = vec2(1.0, 0.0);\n  }\n\n  sin_t = sin_taylor_fp64(a);\n  cos_t = sqrt_fp64(sub_fp64(vec2(1.0, 0.0), mul_fp64(sin_t, sin_t)));\n}\n\nvec2 sin_fp64(vec2 a) {\n    if (a.x == 0.0 && a.y == 0.0) {\n        return vec2(0.0, 0.0);\n    }\n\n    // 2pi range reduction\n    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));\n    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));\n\n    vec2 t;\n    float q = floor(r.x / PI_2_FP64.x + 0.5);\n    int j = int(q);\n\n    if (j < -2 || j > 2) {\n        return vec2(0.0 / 0.0, 0.0 / 0.0);\n    }\n\n    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));\n\n    q = floor(t.x / PI_16_FP64.x + 0.5);\n    int k = int(q);\n\n    if (k == 0) {\n        if (j == 0) {\n            return sin_taylor_fp64(t);\n        } else if (j == 1) {\n            return cos_taylor_fp64(t);\n        } else if (j == -1) {\n            return -cos_taylor_fp64(t);\n        } else {\n            return -sin_taylor_fp64(t);\n        }\n    }\n\n    int abs_k = int(abs(float(k)));\n\n    if (abs_k > 4) {\n        return vec2(0.0 / 0.0, 0.0 / 0.0);\n    } else {\n        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));\n    }\n\n    vec2 u = vec2(0.0, 0.0);\n    vec2 v = vec2(0.0, 0.0);\n\n#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)\n    if (abs(float(abs_k) - 1.0) < 0.5) {\n        u = COS_TABLE_0_FP64;\n        v = SIN_TABLE_0_FP64;\n    } else if (abs(float(abs_k) - 2.0) < 0.5) {\n        u = COS_TABLE_1_FP64;\n        v = SIN_TABLE_1_FP64;\n    } else if (abs(float(abs_k) - 3.0) < 0.5) {\n        u = COS_TABLE_2_FP64;\n        v = SIN_TABLE_2_FP64;\n    } else if (abs(float(abs_k) - 4.0) < 0.5) {\n        u = COS_TABLE_3_FP64;\n        v = SIN_TABLE_3_FP64;\n    }\n#else\n    if (abs_k == 1) {\n        u = COS_TABLE_0_FP64;\n        v = SIN_TABLE_0_FP64;\n    } else if (abs_k == 2) {\n        u = COS_TABLE_1_FP64;\n        v = SIN_TABLE_1_FP64;\n    } else if (abs_k == 3) {\n        u = COS_TABLE_2_FP64;\n        v = SIN_TABLE_2_FP64;\n    } else if (abs_k == 4) {\n        u = COS_TABLE_3_FP64;\n        v = SIN_TABLE_3_FP64;\n    }\n#endif\n\n    vec2 sin_t, cos_t;\n    sincos_taylor_fp64(t, sin_t, cos_t);\n\n\n\n    vec2 result = vec2(0.0, 0.0);\n    if (j == 0) {\n        if (k > 0) {\n            result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n        } else {\n            result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n        }\n    } else if (j == 1) {\n        if (k > 0) {\n            result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        } else {\n            result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        }\n    } else if (j == -1) {\n        if (k > 0) {\n            result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));\n        } else {\n            result = -sum_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));\n        }\n    } else {\n        if (k > 0) {\n            result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n        } else {\n            result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));\n        }\n    }\n\n    return result;\n}\n\nvec2 cos_fp64(vec2 a) {\n    if (a.x == 0.0 && a.y == 0.0) {\n        return vec2(1.0, 0.0);\n    }\n\n    // 2pi range reduction\n    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));\n    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));\n\n    vec2 t;\n    float q = floor(r.x / PI_2_FP64.x + 0.5);\n    int j = int(q);\n\n    if (j < -2 || j > 2) {\n        return vec2(0.0 / 0.0, 0.0 / 0.0);\n    }\n\n    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));\n\n    q = floor(t.x / PI_16_FP64.x + 0.5);\n    int k = int(q);\n\n    if (k == 0) {\n        if (j == 0) {\n            return cos_taylor_fp64(t);\n        } else if (j == 1) {\n            return -sin_taylor_fp64(t);\n        } else if (j == -1) {\n            return sin_taylor_fp64(t);\n        } else {\n            return -cos_taylor_fp64(t);\n        }\n    }\n\n    int abs_k = int(abs(float(k)));\n\n    if (abs_k > 4) {\n        return vec2(0.0 / 0.0, 0.0 / 0.0);\n    } else {\n        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));\n    }\n\n    vec2 u = vec2(0.0, 0.0);\n    vec2 v = vec2(0.0, 0.0);\n\n#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)\n    if (abs(float(abs_k) - 1.0) < 0.5) {\n        u = COS_TABLE_0_FP64;\n        v = SIN_TABLE_0_FP64;\n    } else if (abs(float(abs_k) - 2.0) < 0.5) {\n        u = COS_TABLE_1_FP64;\n        v = SIN_TABLE_1_FP64;\n    } else if (abs(float(abs_k) - 3.0) < 0.5) {\n        u = COS_TABLE_2_FP64;\n        v = SIN_TABLE_2_FP64;\n    } else if (abs(float(abs_k) - 4.0) < 0.5) {\n        u = COS_TABLE_3_FP64;\n        v = SIN_TABLE_3_FP64;\n    }\n#else\n    if (abs_k == 1) {\n        u = COS_TABLE_0_FP64;\n        v = SIN_TABLE_0_FP64;\n    } else if (abs_k == 2) {\n        u = COS_TABLE_1_FP64;\n        v = SIN_TABLE_1_FP64;\n    } else if (abs_k == 3) {\n        u = COS_TABLE_2_FP64;\n        v = SIN_TABLE_2_FP64;\n    } else if (abs_k == 4) {\n        u = COS_TABLE_3_FP64;\n        v = SIN_TABLE_3_FP64;\n    }\n#endif\n\n    vec2 sin_t, cos_t;\n    sincos_taylor_fp64(t, sin_t, cos_t);\n\n    vec2 result = vec2(0.0, 0.0);\n    if (j == 0) {\n        if (k > 0) {\n            result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        } else {\n            result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        }\n    } else if (j == 1) {\n        if (k > 0) {\n            result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n        } else {\n            result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));\n        }\n    } else if (j == -1) {\n        if (k > 0) {\n            result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n        } else {\n            result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n        }\n    } else {\n        if (k > 0) {\n            result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));\n        } else {\n            result = -sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        }\n    }\n\n    return result;\n}\n\nvec2 tan_fp64(vec2 a) {\n    vec2 sin_a;\n    vec2 cos_a;\n\n    if (a.x == 0.0 && a.y == 0.0) {\n        return vec2(0.0, 0.0);\n    }\n\n    // 2pi range reduction\n    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));\n    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));\n\n    vec2 t;\n    float q = floor(r.x / PI_2_FP64.x + 0.5);\n    int j = int(q);\n\n\n    if (j < -2 || j > 2) {\n        return vec2(0.0 / 0.0, 0.0 / 0.0);\n    }\n\n    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));\n\n    q = floor(t.x / PI_16_FP64.x + 0.5);\n    int k = int(q);\n    int abs_k = int(abs(float(k)));\n\n    // We just can't get PI/16 * 3.0 very accurately.\n    // so let's just store it\n    if (abs_k > 4) {\n        return vec2(0.0 / 0.0, 0.0 / 0.0);\n    } else {\n        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));\n    }\n\n\n    vec2 u = vec2(0.0, 0.0);\n    vec2 v = vec2(0.0, 0.0);\n\n    vec2 sin_t, cos_t;\n    vec2 s, c;\n    sincos_taylor_fp64(t, sin_t, cos_t);\n\n    if (k == 0) {\n        s = sin_t;\n        c = cos_t;\n    } else {\n#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)\n        if (abs(float(abs_k) - 1.0) < 0.5) {\n            u = COS_TABLE_0_FP64;\n            v = SIN_TABLE_0_FP64;\n        } else if (abs(float(abs_k) - 2.0) < 0.5) {\n            u = COS_TABLE_1_FP64;\n            v = SIN_TABLE_1_FP64;\n        } else if (abs(float(abs_k) - 3.0) < 0.5) {\n            u = COS_TABLE_2_FP64;\n            v = SIN_TABLE_2_FP64;\n        } else if (abs(float(abs_k) - 4.0) < 0.5) {\n            u = COS_TABLE_3_FP64;\n            v = SIN_TABLE_3_FP64;\n        }\n#else\n        if (abs_k == 1) {\n            u = COS_TABLE_0_FP64;\n            v = SIN_TABLE_0_FP64;\n        } else if (abs_k == 2) {\n            u = COS_TABLE_1_FP64;\n            v = SIN_TABLE_1_FP64;\n        } else if (abs_k == 3) {\n            u = COS_TABLE_2_FP64;\n            v = SIN_TABLE_2_FP64;\n        } else if (abs_k == 4) {\n            u = COS_TABLE_3_FP64;\n            v = SIN_TABLE_3_FP64;\n        }\n#endif\n        if (k > 0) {\n            s = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n            c = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        } else {\n            s = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));\n            c = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));\n        }\n    }\n\n    if (j == 0) {\n        sin_a = s;\n        cos_a = c;\n    } else if (j == 1) {\n        sin_a = c;\n        cos_a = -s;\n    } else if (j == -1) {\n        sin_a = -c;\n        cos_a = s;\n    } else {\n        sin_a = -s;\n        cos_a = -c;\n    }\n    return div_fp64(sin_a, cos_a);\n}\n\nvec2 radians_fp64(vec2 degree) {\n  return mul_fp64(degree, PI_180_FP64);\n}\n\nvec2 mix_fp64(vec2 a, vec2 b, float x) {\n  vec2 range = sub_fp64(b, a);\n  return sum_fp64(a, mul_fp64(range, vec2(x, 0.0)));\n}\n\n// Vector functions\n// vec2 functions\nvoid vec2_sum_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {\n    out_val[0] = sum_fp64(a[0], b[0]);\n    out_val[1] = sum_fp64(a[1], b[1]);\n}\n\nvoid vec2_sub_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {\n    out_val[0] = sub_fp64(a[0], b[0]);\n    out_val[1] = sub_fp64(a[1], b[1]);\n}\n\nvoid vec2_mul_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {\n    out_val[0] = mul_fp64(a[0], b[0]);\n    out_val[1] = mul_fp64(a[1], b[1]);\n}\n\nvoid vec2_div_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {\n    out_val[0] = div_fp64(a[0], b[0]);\n    out_val[1] = div_fp64(a[1], b[1]);\n}\n\nvoid vec2_mix_fp64(vec2 x[2], vec2 y[2], float a, out vec2 out_val[2]) {\n  vec2 range[2];\n  vec2_sub_fp64(y, x, range);\n  vec2 portion[2];\n  portion[0] = range[0] * a;\n  portion[1] = range[1] * a;\n  vec2_sum_fp64(x, portion, out_val);\n}\n\nvec2 vec2_length_fp64(vec2 x[2]) {\n  return sqrt_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])));\n}\n\nvoid vec2_normalize_fp64(vec2 x[2], out vec2 out_val[2]) {\n  vec2 length = vec2_length_fp64(x);\n  vec2 length_vec2[2];\n  length_vec2[0] = length;\n  length_vec2[1] = length;\n\n  vec2_div_fp64(x, length_vec2, out_val);\n}\n\nvec2 vec2_distance_fp64(vec2 x[2], vec2 y[2]) {\n  vec2 diff[2];\n  vec2_sub_fp64(x, y, diff);\n  return vec2_length_fp64(diff);\n}\n\nvec2 vec2_dot_fp64(vec2 a[2], vec2 b[2]) {\n  vec2 v[2];\n\n  v[0] = mul_fp64(a[0], b[0]);\n  v[1] = mul_fp64(a[1], b[1]);\n\n  return sum_fp64(v[0], v[1]);\n}\n\n// vec3 functions\nvoid vec3_sub_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {\n  for (int i = 0; i < 3; i++) {\n    out_val[i] = sum_fp64(a[i], b[i]);\n  }\n}\n\nvoid vec3_sum_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {\n  for (int i = 0; i < 3; i++) {\n    out_val[i] = sum_fp64(a[i], b[i]);\n  }\n}\n\nvec2 vec3_length_fp64(vec2 x[3]) {\n  return sqrt_fp64(sum_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])),\n    mul_fp64(x[2], x[2])));\n}\n\nvec2 vec3_distance_fp64(vec2 x[3], vec2 y[3]) {\n  vec2 diff[3];\n  vec3_sub_fp64(x, y, diff);\n  return vec3_length_fp64(diff);\n}\n\n// vec4 functions\nvoid vec4_fp64(vec4 a, out vec2 out_val[4]) {\n  out_val[0].x = a[0];\n  out_val[0].y = 0.0;\n\n  out_val[1].x = a[1];\n  out_val[1].y = 0.0;\n\n  out_val[2].x = a[2];\n  out_val[2].y = 0.0;\n\n  out_val[3].x = a[3];\n  out_val[3].y = 0.0;\n}\n\nvoid vec4_scalar_mul_fp64(vec2 a[4], vec2 b, out vec2 out_val[4]) {\n  out_val[0] = mul_fp64(a[0], b);\n  out_val[1] = mul_fp64(a[1], b);\n  out_val[2] = mul_fp64(a[2], b);\n  out_val[3] = mul_fp64(a[3], b);\n}\n\nvoid vec4_sum_fp64(vec2 a[4], vec2 b[4], out vec2 out_val[4]) {\n  for (int i = 0; i < 4; i++) {\n    out_val[i] = sum_fp64(a[i], b[i]);\n  }\n}\n\nvoid vec4_dot_fp64(vec2 a[4], vec2 b[4], out vec2 out_val) {\n  vec2 v[4];\n\n  v[0] = mul_fp64(a[0], b[0]);\n  v[1] = mul_fp64(a[1], b[1]);\n  v[2] = mul_fp64(a[2], b[2]);\n  v[3] = mul_fp64(a[3], b[3]);\n\n  out_val = sum_fp64(sum_fp64(v[0], v[1]), sum_fp64(v[2], v[3]));\n}\n\nvoid mat4_vec4_mul_fp64(vec2 b[16], vec2 a[4], out vec2 out_val[4]) {\n  vec2 tmp[4];\n\n  for (int i = 0; i < 4; i++)\n  {\n    for (int j = 0; j < 4; j++)\n    {\n      tmp[j] = b[j + i * 4];\n    }\n    vec4_dot_fp64(a, tmp, out_val[i]);\n  }\n}\n";
//# sourceMappingURL=fp64-functions.glsl.js.map