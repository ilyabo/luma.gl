import { getContextInfo } from '../../webgl';
import { hasFeature, FEATURES } from '../../webgl/context-features';
import { window, document } from 'global';

var isIE11 = window && Boolean(window.MSInputMethodContext) && Boolean(document.documentMode);

export function checkRendererVendor(debugInfo, gpuVendor) {
  var vendor = debugInfo.vendor,
      renderer = debugInfo.renderer;

  var result = void 0;
  switch (gpuVendor) {
    case 'nvidia':
      result = vendor.match(/NVIDIA/i) || renderer.match(/NVIDIA/i);
      break;
    case 'intel':
      result = vendor.match(/INTEL/i) || renderer.match(/INTEL/i);
      break;
    case 'amd':
      result = vendor.match(/AMD/i) || renderer.match(/AMD/i) || vendor.match(/ATI/i) || renderer.match(/ATI/i);
      break;
    default:
      result = false;
  }
  return result;
}

export function getPlatformShaderDefines(gl) {
  /* eslint-disable */
  var platformDefines = '';
  var debugInfo = getContextInfo(gl);

  if (checkRendererVendor(debugInfo, 'nvidia')) {
    platformDefines += '#define NVIDIA_GPU\n// Nvidia optimizes away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n';
  } else if (checkRendererVendor(debugInfo, 'intel')) {
    platformDefines += '#define INTEL_GPU\n// Intel optimizes away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n// Intel\'s built-in \'tan\' function doesn\'t have acceptable precision\n#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1\n// Intel GPU doesn\'t have full 32 bits precision in same cases, causes overflow\n#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1\n';
  } else if (checkRendererVendor(debugInfo, 'amd')) {
    // AMD Does not eliminate fp64 code
    platformDefines += '#define AMD_GPU\n';
  } else {
    // We don't know what GPU it is, could be that the GPU driver or
    // browser is not implementing UNMASKED_RENDERER constant and not
    // reporting a correct name
    platformDefines += '#define DEFAULT_GPU\n// Prevent driver from optimizing away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n// Intel\'s built-in \'tan\' function doesn\'t have acceptable precision\n#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1\n// Intel GPU doesn\'t have full 32 bits precision in same cases, causes overflow\n#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1\n';
  }

  return platformDefines;
}

export function getVersionDefines(gl) {
  var versionDefines = '// Defines for shader portability\n#if (__VERSION__ > 120)\n# define attribute in\n# define varying out\n# define FRAG_DEPTH\n# define DERIVATIVES\n# define DRAW_BUFFERS\n# define TEXTURE_LOD\n#else\n// # define in attribute\n// # define out varying\n#endif // __VERSION\n';

  if (hasFeature(gl, FEATURES.GLSL_FRAG_DEPTH)) {
    versionDefines += '// FRAG_DEPTH => gl_FragDepth is available\n#ifdef GL_EXT_frag_depth\n#extension GL_EXT_frag_depth : enable\n# define FRAG_DEPTH\n# define gl_FragDepth gl_FragDepthEXT\n#endif\n';
  }
  if (hasFeature(gl, FEATURES.GLSL_DERIVATIVES) && !isIE11) {
    versionDefines += '// DERIVATIVES => dxdF, dxdY and fwidth are available\n#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n# define DERIVATIVES\n#endif\n';
  }
  if (hasFeature(gl, FEATURES.GLSL_FRAG_DATA) && !isIE11) {
    versionDefines += '// DRAW_BUFFERS => gl_FragData[] is available\n#ifdef GL_EXT_draw_buffers\n#extension GL_EXT_draw_buffers : require\n#define DRAW_BUFFERS\n#endif\n';
  }
  if (hasFeature(gl, FEATURES.GLSL_TEXTURE_LOD)) {
    versionDefines += '// TEXTURE_LOD => texture2DLod etc are available\n#ifdef GL_EXT_shader_texture_lod\n#extension GL_EXT_shader_texture_lod : enable\n# define TEXTURE_LOD\n#define texture2DLod texture2DLodEXT\n#define texture2DProjLod texture2DProjLodEXT\n#define texture2DProjLod texture2DProjLodEXT\n#define textureCubeLod textureCubeLodEXT\n#define texture2DGrad texture2DGradEXT\n#define texture2DProjGrad texture2DProjGradEXT\n#define texture2DProjGrad texture2DProjGradEXT\n#define textureCubeGrad textureCubeGradEXT\n#endif\n';
  }
  return versionDefines;
}
//# sourceMappingURL=platform-defines.js.map