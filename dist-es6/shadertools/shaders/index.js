// Default Shaders

// A set of base shaders that leverage the shader module system,
// dynamically enabling features depending on which modules are included
import MODULAR_VS from './modular-vertex.glsl';
import MODULAR_FS from './modular-fragment.glsl';

export var MODULAR_SHADERS = {
  vs: MODULAR_VS,
  fs: MODULAR_FS,
  defaultUniforms: {}
};
//# sourceMappingURL=index.js.map