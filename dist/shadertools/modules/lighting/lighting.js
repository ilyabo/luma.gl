'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.name = exports.fragmentShader = exports.vertexShader = undefined;
exports.getUniforms = getUniforms;

var _math = require('math.gl');

var _lightingCommon = require('./lighting-common.glsl');

var _lightingCommon2 = _interopRequireDefault(_lightingCommon);

var _lightingVertex = require('./lighting-vertex.glsl');

var _lightingVertex2 = _interopRequireDefault(_lightingVertex);

var _lightingFragment = require('./lighting-fragment.glsl');

var _lightingFragment2 = _interopRequireDefault(_lightingFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vertexShader = exports.vertexShader = _lightingCommon2.default + '\n' + _lightingVertex2.default + '\n';

var fragmentShader = exports.fragmentShader = _lightingCommon2.default + '\n' + _lightingFragment2.default + '\n';

var name = exports.name = 'lighting';

var config = exports.config = {
  MAX_POINT_LIGHTS: 4
};

// Setup the lighting system: ambient, directional, point lights.
function getUniforms(_ref) {
  var _ref$lightingEnable = _ref.lightingEnable,
      lightingEnable = _ref$lightingEnable === undefined ? false : _ref$lightingEnable,
      _ref$lightingAmbientC = _ref.lightingAmbientColor,
      lightingAmbientColor = _ref$lightingAmbientC === undefined ? [0.2, 0.2, 0.2] : _ref$lightingAmbientC,
      _ref$lightingDirectio = _ref.lightingDirection,
      lightingDirection = _ref$lightingDirectio === undefined ? [1, 1, 1] : _ref$lightingDirectio,
      _ref$lightingDirectio2 = _ref.lightingDirectionalColor,
      lightingDirectionalColor = _ref$lightingDirectio2 === undefined ? [0, 0, 0] : _ref$lightingDirectio2,
      _ref$lightingPointLig = _ref.lightingPointLights,
      lightingPointLights = _ref$lightingPointLig === undefined ? [] : _ref$lightingPointLig;

  // Set light uniforms. Ambient, directional and point lights.
  return Object.assign({
    lightingEnable: lightingEnable,
    // Ambient
    lightingAmbientColor: lightingAmbientColor
  }, getDirectionalUniforms(lightingDirection), getPointUniforms(lightingPointLights));
}

function getDirectionalUniforms(_ref2) {
  var color = _ref2.color,
      direction = _ref2.direction;

  // Normalize lighting direction vector
  var dir = new _math.Vector3(direction.x, direction.y, direction.z).normalize().scale(-1, -1, -1);

  return {
    directionalColor: [color.r, color.g, color.b],
    lightingDirection: [dir.x, dir.y, dir.z]
  };
}

function getPointUniforms(points) {
  points = points instanceof Array ? points : [points];
  var numberPoints = points.length;
  var pointLocations = [];
  var pointColors = [];
  var enableSpecular = [];
  var pointSpecularColors = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var point = _step.value;
      var position = point.position,
          color = point.color,
          diffuse = point.diffuse,
          specular = point.specular;

      var pointColor = color || diffuse;

      pointLocations.push(position.x, position.y, position.z);
      pointColors.push(pointColor.r, pointColor.g, pointColor.b);

      // Add specular color
      enableSpecular.push(Number(Boolean(specular)));
      if (specular) {
        pointSpecularColors.push(specular.r, specular.g, specular.b);
      } else {
        pointSpecularColors.push(0, 0, 0);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    numberPoints: numberPoints,
    pointLocation: pointLocations,
    pointColor: pointColors,
    enableSpecular: enableSpecular,
    pointSpecularColor: pointSpecularColors
  };
}
//# sourceMappingURL=lighting.js.map