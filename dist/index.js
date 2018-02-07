'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FramebufferObject = exports.readPixels = exports.SphericalCoordinates = undefined;
exports.Euler = exports.Quaternion = exports.Matrix4 = exports.Vector4 = exports.Vector3 = exports.Vector2 = exports.degrees = exports.radians = exports.experimental = exports.diffuse = exports.picking = exports.dirlight = exports.lighting = exports.project = exports.fp64 = exports.fp32 = exports.setDefaultShaderModules = exports.registerShaderModules = exports.assembleShaders = exports.ShaderCache = exports.parseModel = exports.loadModel = exports.loadProgram = exports.loadTextures = exports.loadImages = exports.loadFiles = exports.loadImage = exports.loadFile = exports.setPathPrefix = exports.ClipSpaceQuad = exports.TruncatedCone = exports.Sphere = exports.Plane = exports.IcoSphere = exports.Cylinder = exports.Cube = exports.Cone = exports.TruncatedConeGeometry = exports.SphereGeometry = exports.PlaneGeometry = exports.IcoSphereGeometry = exports.CylinderGeometry = exports.CubeGeometry = exports.ConeGeometry = exports.Geometry = exports.addEvents = exports.getNullPickingColor = exports.decodePickingColor = exports.encodePickingColor = exports.pickModels = exports.AnimationLoop = exports.Model = exports.UniformBufferLayout = exports.VertexArray = exports.TransformFeedback = exports.Texture2DArray = exports.Texture3D = exports.Sampler = exports.Query = exports.FenceSync = exports.clearBuffer = exports.clear = exports.draw = exports.TextureCube = exports.Texture2D = exports.Renderbuffer = exports.Framebuffer = exports.Program = exports.FragmentShader = exports.VertexShader = exports.Shader = exports.Buffer = exports.installParameterDefinitions = exports.makeDebugContext = exports.getFeatures = exports.hasFeatures = exports.hasFeature = exports.FEATURES = exports.glGetDebugInfo = exports.getContextLimits = exports.getGLContextInfo = exports.getContextInfo = exports.getModifiedParameters = exports.withParameters = exports.setParameters = exports.setParameter = exports.getParameters = exports.getParameter = exports.resetParameters = exports.pollContext = exports.deleteGLContext = exports.createGLContext = exports.setContextDefaults = exports.isWebGL2 = exports.isWebGL = exports.trackContextState = exports.trackContextCreation = exports.glKey = exports.glGet = exports.GL = undefined;

var _glConstants = require('./webgl/gl-constants');

Object.defineProperty(exports, 'GL', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_glConstants).default;
  }
});
Object.defineProperty(exports, 'glGet', {
  enumerable: true,
  get: function get() {
    return _glConstants.glGet;
  }
});
Object.defineProperty(exports, 'glKey', {
  enumerable: true,
  get: function get() {
    return _glConstants.glKey;
  }
});

var _webglUtils = require('./webgl-utils');

Object.defineProperty(exports, 'trackContextCreation', {
  enumerable: true,
  get: function get() {
    return _webglUtils.trackContextCreation;
  }
});
Object.defineProperty(exports, 'trackContextState', {
  enumerable: true,
  get: function get() {
    return _webglUtils.trackContextState;
  }
});

var _context = require('./webgl/context');

Object.defineProperty(exports, 'isWebGL', {
  enumerable: true,
  get: function get() {
    return _context.isWebGL;
  }
});
Object.defineProperty(exports, 'isWebGL2', {
  enumerable: true,
  get: function get() {
    return _context.isWebGL2;
  }
});
Object.defineProperty(exports, 'setContextDefaults', {
  enumerable: true,
  get: function get() {
    return _context.setContextDefaults;
  }
});
Object.defineProperty(exports, 'createGLContext', {
  enumerable: true,
  get: function get() {
    return _context.createGLContext;
  }
});
Object.defineProperty(exports, 'deleteGLContext', {
  enumerable: true,
  get: function get() {
    return _context.deleteGLContext;
  }
});
Object.defineProperty(exports, 'pollContext', {
  enumerable: true,
  get: function get() {
    return _context.pollContext;
  }
});

var _contextState = require('./webgl/context-state');

Object.defineProperty(exports, 'resetParameters', {
  enumerable: true,
  get: function get() {
    return _contextState.resetParameters;
  }
});
Object.defineProperty(exports, 'getParameter', {
  enumerable: true,
  get: function get() {
    return _contextState.getParameter;
  }
});
Object.defineProperty(exports, 'getParameters', {
  enumerable: true,
  get: function get() {
    return _contextState.getParameters;
  }
});
Object.defineProperty(exports, 'setParameter', {
  enumerable: true,
  get: function get() {
    return _contextState.setParameter;
  }
});
Object.defineProperty(exports, 'setParameters', {
  enumerable: true,
  get: function get() {
    return _contextState.setParameters;
  }
});
Object.defineProperty(exports, 'withParameters', {
  enumerable: true,
  get: function get() {
    return _contextState.withParameters;
  }
});
Object.defineProperty(exports, 'getModifiedParameters', {
  enumerable: true,
  get: function get() {
    return _contextState.getModifiedParameters;
  }
});

var _contextLimits = require('./webgl/context-limits');

Object.defineProperty(exports, 'getContextInfo', {
  enumerable: true,
  get: function get() {
    return _contextLimits.getContextInfo;
  }
});
Object.defineProperty(exports, 'getGLContextInfo', {
  enumerable: true,
  get: function get() {
    return _contextLimits.getGLContextInfo;
  }
});
Object.defineProperty(exports, 'getContextLimits', {
  enumerable: true,
  get: function get() {
    return _contextLimits.getContextLimits;
  }
});
Object.defineProperty(exports, 'glGetDebugInfo', {
  enumerable: true,
  get: function get() {
    return _contextLimits.glGetDebugInfo;
  }
});

var _contextFeatures = require('./webgl/context-features');

Object.defineProperty(exports, 'FEATURES', {
  enumerable: true,
  get: function get() {
    return _contextFeatures.FEATURES;
  }
});
Object.defineProperty(exports, 'hasFeature', {
  enumerable: true,
  get: function get() {
    return _contextFeatures.hasFeature;
  }
});
Object.defineProperty(exports, 'hasFeatures', {
  enumerable: true,
  get: function get() {
    return _contextFeatures.hasFeatures;
  }
});
Object.defineProperty(exports, 'getFeatures', {
  enumerable: true,
  get: function get() {
    return _contextFeatures.getFeatures;
  }
});

var _contextDebug = require('./webgl/context-debug');

Object.defineProperty(exports, 'makeDebugContext', {
  enumerable: true,
  get: function get() {
    return _contextDebug.makeDebugContext;
  }
});

var _debugParameters = require('./webgl/api/debug-parameters');

Object.defineProperty(exports, 'installParameterDefinitions', {
  enumerable: true,
  get: function get() {
    return _debugParameters.installParameterDefinitions;
  }
});

var _buffer = require('./webgl/buffer');

Object.defineProperty(exports, 'Buffer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_buffer).default;
  }
});

var _shader = require('./webgl/shader');

Object.defineProperty(exports, 'Shader', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_shader).default;
  }
});
Object.defineProperty(exports, 'VertexShader', {
  enumerable: true,
  get: function get() {
    return _shader.VertexShader;
  }
});
Object.defineProperty(exports, 'FragmentShader', {
  enumerable: true,
  get: function get() {
    return _shader.FragmentShader;
  }
});

var _program = require('./webgl/program');

Object.defineProperty(exports, 'Program', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_program).default;
  }
});

var _framebuffer = require('./webgl/framebuffer');

Object.defineProperty(exports, 'Framebuffer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_framebuffer).default;
  }
});

var _renderbuffer = require('./webgl/renderbuffer');

Object.defineProperty(exports, 'Renderbuffer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_renderbuffer).default;
  }
});

var _texture2d = require('./webgl/texture-2d');

Object.defineProperty(exports, 'Texture2D', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_texture2d).default;
  }
});

var _textureCube = require('./webgl/texture-cube');

Object.defineProperty(exports, 'TextureCube', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_textureCube).default;
  }
});

var _draw = require('./webgl/draw');

Object.defineProperty(exports, 'draw', {
  enumerable: true,
  get: function get() {
    return _draw.draw;
  }
});

var _clear = require('./webgl/clear');

Object.defineProperty(exports, 'clear', {
  enumerable: true,
  get: function get() {
    return _clear.clear;
  }
});
Object.defineProperty(exports, 'clearBuffer', {
  enumerable: true,
  get: function get() {
    return _clear.clearBuffer;
  }
});

var _fenceSync = require('./webgl/fence-sync');

Object.defineProperty(exports, 'FenceSync', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fenceSync).default;
  }
});

var _query = require('./webgl/query');

Object.defineProperty(exports, 'Query', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_query).default;
  }
});

var _sampler = require('./webgl/sampler');

Object.defineProperty(exports, 'Sampler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sampler).default;
  }
});

var _texture3d = require('./webgl/texture-3d');

Object.defineProperty(exports, 'Texture3D', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_texture3d).default;
  }
});

var _texture2dArray = require('./webgl/texture-2d-array');

Object.defineProperty(exports, 'Texture2DArray', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_texture2dArray).default;
  }
});

var _transformFeedback = require('./webgl/transform-feedback');

Object.defineProperty(exports, 'TransformFeedback', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_transformFeedback).default;
  }
});

var _vertexArray = require('./webgl/vertex-array');

Object.defineProperty(exports, 'VertexArray', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_vertexArray).default;
  }
});

var _uniformBufferLayout = require('./webgl/uniform-buffer-layout');

Object.defineProperty(exports, 'UniformBufferLayout', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_uniformBufferLayout).default;
  }
});

var _model = require('./core/model');

Object.defineProperty(exports, 'Model', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_model).default;
  }
});

var _animationLoop = require('./core/animation-loop');

Object.defineProperty(exports, 'AnimationLoop', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_animationLoop).default;
  }
});

var _pickModels = require('./core/pick-models');

Object.defineProperty(exports, 'pickModels', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pickModels).default;
  }
});

var _pickingColors = require('./core/picking-colors');

Object.defineProperty(exports, 'encodePickingColor', {
  enumerable: true,
  get: function get() {
    return _pickingColors.encodePickingColor;
  }
});
Object.defineProperty(exports, 'decodePickingColor', {
  enumerable: true,
  get: function get() {
    return _pickingColors.decodePickingColor;
  }
});
Object.defineProperty(exports, 'getNullPickingColor', {
  enumerable: true,
  get: function get() {
    return _pickingColors.getNullPickingColor;
  }
});

var _events = require('./packages/events');

Object.defineProperty(exports, 'addEvents', {
  enumerable: true,
  get: function get() {
    return _events.addEvents;
  }
});

var _geometry = require('./geometry/geometry');

Object.defineProperty(exports, 'Geometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geometry).default;
  }
});

var _coneGeometry = require('./geometry/cone-geometry');

Object.defineProperty(exports, 'ConeGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_coneGeometry).default;
  }
});

var _cubeGeometry = require('./geometry/cube-geometry');

Object.defineProperty(exports, 'CubeGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cubeGeometry).default;
  }
});

var _cylinderGeometry = require('./geometry/cylinder-geometry');

Object.defineProperty(exports, 'CylinderGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cylinderGeometry).default;
  }
});

var _icoSphereGeometry = require('./geometry/ico-sphere-geometry');

Object.defineProperty(exports, 'IcoSphereGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_icoSphereGeometry).default;
  }
});

var _planeGeometry = require('./geometry/plane-geometry');

Object.defineProperty(exports, 'PlaneGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_planeGeometry).default;
  }
});

var _sphereGeometry = require('./geometry/sphere-geometry');

Object.defineProperty(exports, 'SphereGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sphereGeometry).default;
  }
});

var _truncatedConeGeometry = require('./geometry/truncated-cone-geometry');

Object.defineProperty(exports, 'TruncatedConeGeometry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_truncatedConeGeometry).default;
  }
});

var _cone = require('./models/cone');

Object.defineProperty(exports, 'Cone', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cone).default;
  }
});

var _cube = require('./models/cube');

Object.defineProperty(exports, 'Cube', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cube).default;
  }
});

var _cylinder = require('./models/cylinder');

Object.defineProperty(exports, 'Cylinder', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cylinder).default;
  }
});

var _icoSphere = require('./models/ico-sphere');

Object.defineProperty(exports, 'IcoSphere', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_icoSphere).default;
  }
});

var _plane = require('./models/plane');

Object.defineProperty(exports, 'Plane', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_plane).default;
  }
});

var _sphere = require('./models/sphere');

Object.defineProperty(exports, 'Sphere', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sphere).default;
  }
});

var _truncatedCone = require('./models/truncated-cone');

Object.defineProperty(exports, 'TruncatedCone', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_truncatedCone).default;
  }
});

var _clipSpaceQuad = require('./models/clip-space-quad');

Object.defineProperty(exports, 'ClipSpaceQuad', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_clipSpaceQuad).default;
  }
});

var _io = require('./io');

Object.defineProperty(exports, 'setPathPrefix', {
  enumerable: true,
  get: function get() {
    return _io.setPathPrefix;
  }
});
Object.defineProperty(exports, 'loadFile', {
  enumerable: true,
  get: function get() {
    return _io.loadFile;
  }
});
Object.defineProperty(exports, 'loadImage', {
  enumerable: true,
  get: function get() {
    return _io.loadImage;
  }
});
Object.defineProperty(exports, 'loadFiles', {
  enumerable: true,
  get: function get() {
    return _io.loadFiles;
  }
});
Object.defineProperty(exports, 'loadImages', {
  enumerable: true,
  get: function get() {
    return _io.loadImages;
  }
});
Object.defineProperty(exports, 'loadTextures', {
  enumerable: true,
  get: function get() {
    return _io.loadTextures;
  }
});
Object.defineProperty(exports, 'loadProgram', {
  enumerable: true,
  get: function get() {
    return _io.loadProgram;
  }
});
Object.defineProperty(exports, 'loadModel', {
  enumerable: true,
  get: function get() {
    return _io.loadModel;
  }
});
Object.defineProperty(exports, 'parseModel', {
  enumerable: true,
  get: function get() {
    return _io.parseModel;
  }
});

var _shaderCache = require('./shadertools/lib/shader-cache');

Object.defineProperty(exports, 'ShaderCache', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_shaderCache).default;
  }
});

var _assembleShaders = require('./shadertools/lib/assemble-shaders');

Object.defineProperty(exports, 'assembleShaders', {
  enumerable: true,
  get: function get() {
    return _assembleShaders.assembleShaders;
  }
});

var _shaderModules = require('./shadertools/lib/shader-modules');

Object.defineProperty(exports, 'registerShaderModules', {
  enumerable: true,
  get: function get() {
    return _shaderModules.registerShaderModules;
  }
});
Object.defineProperty(exports, 'setDefaultShaderModules', {
  enumerable: true,
  get: function get() {
    return _shaderModules.setDefaultShaderModules;
  }
});

var _fp = require('./shadertools/modules/fp32/fp32');

Object.defineProperty(exports, 'fp32', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fp).default;
  }
});

var _fp2 = require('./shadertools/modules/fp64/fp64');

Object.defineProperty(exports, 'fp64', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fp2).default;
  }
});

var _project = require('./shadertools/modules/project/project');

Object.defineProperty(exports, 'project', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_project).default;
  }
});

var _lighting = require('./shadertools/modules/lighting/lighting');

Object.defineProperty(exports, 'lighting', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_lighting).default;
  }
});

var _dirlight = require('./shadertools/modules/dirlight/dirlight');

Object.defineProperty(exports, 'dirlight', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_dirlight).default;
  }
});

var _picking = require('./shadertools/modules/picking/picking');

Object.defineProperty(exports, 'picking', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_picking).default;
  }
});

var _diffuse = require('./shadertools/modules/diffuse/diffuse');

Object.defineProperty(exports, 'diffuse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_diffuse).default;
  }
});

var _math = require('math.gl');

Object.defineProperty(exports, 'radians', {
  enumerable: true,
  get: function get() {
    return _math.radians;
  }
});
Object.defineProperty(exports, 'degrees', {
  enumerable: true,
  get: function get() {
    return _math.degrees;
  }
});
Object.defineProperty(exports, 'Vector2', {
  enumerable: true,
  get: function get() {
    return _math.Vector2;
  }
});
Object.defineProperty(exports, 'Vector3', {
  enumerable: true,
  get: function get() {
    return _math.Vector3;
  }
});
Object.defineProperty(exports, 'Vector4', {
  enumerable: true,
  get: function get() {
    return _math.Vector4;
  }
});
Object.defineProperty(exports, 'Matrix4', {
  enumerable: true,
  get: function get() {
    return _math.Matrix4;
  }
});
Object.defineProperty(exports, 'Quaternion', {
  enumerable: true,
  get: function get() {
    return _math.Quaternion;
  }
});
Object.defineProperty(exports, 'Euler', {
  enumerable: true,
  get: function get() {
    return _math.Euler;
  }
});
Object.defineProperty(exports, 'SphericalCoordinates', {
  enumerable: true,
  get: function get() {
    return _math.SphericalCoordinates;
  }
});

var _functions = require('./webgl/functions');

Object.defineProperty(exports, 'readPixels', {
  enumerable: true,
  get: function get() {
    return _functions.readPixels;
  }
});
Object.defineProperty(exports, 'FramebufferObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_framebuffer).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export core modules for luma.gl

// Initialize any global state
require('./init');

// WebGL


// EXPERIMENTAL EXPORTS

var experimental = exports.experimental = {
  clearBuffer: _clear.clearBuffer
};

// DEPRECATED EXPORTS

// DEPRECATED IN V4.1
//# sourceMappingURL=index.js.map