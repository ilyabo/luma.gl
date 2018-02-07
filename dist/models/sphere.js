'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _geometry = require('../geometry');

var _utils = require('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sphere = /*#__PURE__*/function (_Model) {
  _inherits(Sphere, _Model);

  function Sphere(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Sphere);

    var _opts$id = opts.id,
        id = _opts$id === undefined ? (0, _utils.uid)('sphere') : _opts$id;
    return _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, gl, Object.assign({}, opts, { id: id, geometry: new _geometry.SphereGeometry(opts) })));
  }

  return Sphere;
}(_core.Model);

exports.default = Sphere;
//# sourceMappingURL=sphere.js.map