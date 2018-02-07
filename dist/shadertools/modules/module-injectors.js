"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MODULE_INJECTORS_VS = exports.MODULE_INJECTORS_VS = "#ifdef MODULE_LOGDEPTH\n  logdepth_adjustPosition(gl_Position);\n#endif\n";

var MODULE_INJECTORS_FS = exports.MODULE_INJECTORS_FS = "#ifdef MODULE_MATERIAL\n  gl_FragColor = material_filterColor(gl_FragColor);\n#endif\n\n#ifdef MODULE_LIGHTING\n  gl_FragColor = lighting_filterColor(gl_FragColor);\n#endif\n\n#ifdef MODULE_FOG\n  gl_FragColor = fog_filterColor(gl_FragColor);\n#endif\n\n#ifdef MODULE_PICKING\n  gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n  gl_FragColor = picking_filterPickingColor(gl_FragColor);\n#endif\n\n#ifdef MODULE_LOGDEPTH\n  logdepth_setFragDepth();\n#endif\n";
//# sourceMappingURL=module-injectors.js.map