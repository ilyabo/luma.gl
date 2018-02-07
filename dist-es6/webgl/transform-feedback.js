var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import GL from './gl-constants';
import Resource from './resource';
import { isWebGL2, assertWebGL2Context } from './context';
import assert from 'assert';

var GL_TRANSFORM_FEEDBACK_BUFFER = 0x8C8E;
var GL_TRANSFORM_FEEDBACK = 0x8E22;

var TranformFeedback = /*#__PURE__*/function (_Resource) {
  _inherits(TranformFeedback, _Resource);

  _createClass(TranformFeedback, null, [{
    key: 'isSupported',
    value: function isSupported(gl) {
      return isWebGL2(gl);
    }
  }, {
    key: 'isHandle',
    value: function isHandle(handle) {
      return this.gl.isTransformFeedback(this.handle);
    }

    /**
     * @class
     * @param {WebGL2RenderingContext} gl - context
     * @param {Object} opts - options
     */

  }]);

  function TranformFeedback(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, TranformFeedback);

    assertWebGL2Context(gl);

    var _this = _possibleConstructorReturn(this, (TranformFeedback.__proto__ || Object.getPrototypeOf(TranformFeedback)).call(this, gl, opts));

    _this.buffers = {};
    Object.seal(_this);

    _this.initialize(opts);
    return _this;
  }

  _createClass(TranformFeedback, [{
    key: 'initialize',
    value: function initialize(_ref) {
      var _ref$buffers = _ref.buffers,
          buffers = _ref$buffers === undefined ? {} : _ref$buffers;

      this.bindBuffers(buffers, { clear: true });
    }
  }, {
    key: 'bindBuffers',
    value: function bindBuffers() {
      var buffers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _ref2 = arguments[1];
      var clear = _ref2.clear,
          _ref2$varyingMap = _ref2.varyingMap,
          varyingMap = _ref2$varyingMap === undefined ? {} : _ref2$varyingMap;

      if (clear) {
        this._unbindBuffers();
        this.buffers = {};
      }
      var bufferIndex = 0;
      for (var bufferName in buffers) {
        var buffer = buffers[bufferName];
        var index = bufferIndex++;
        assert(Number.isFinite(index));
        this.buffers[index] = buffer;
      }
    }

    // TODO: Activation is tightly coupled to the current program. Since we try to encapsulate
    // program.use, should we move these methods (begin/pause/resume/end) to the Program?

  }, {
    key: 'begin',
    value: function begin(primitiveMode) {
      this._bindBuffers();
      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, this.handle);
      this.gl.beginTransformFeedback(primitiveMode);
      return this;
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, this.handle);
      this.gl.pauseTransformFeedback();
      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, null);
      this._unbindBuffers();
      return this;
    }
  }, {
    key: 'resume',
    value: function resume() {
      this._bindBuffers();
      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, this.handle);
      this.gl.resumeTransformFeedback();
      return this;
    }
  }, {
    key: 'end',
    value: function end() {
      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, this.handle);
      this.gl.endTransformFeedback();
      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, null);
      this._unbindBuffers();
      return this;
    }
  }, {
    key: 'bindBuffer',
    value: function bindBuffer(_ref3) {
      var index = _ref3.index,
          buffer = _ref3.buffer,
          _ref3$offset = _ref3.offset,
          offset = _ref3$offset === undefined ? 0 : _ref3$offset,
          size = _ref3.size;

      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, this.handle);
      if (size === undefined) {
        this.gl.bindBufferBase(GL_TRANSFORM_FEEDBACK_BUFFER, index, buffer.handle);
      } else {
        this.gl.bindBufferRange(GL_TRANSFORM_FEEDBACK_BUFFER, index, buffer.handle, offset, size);
      }
      return this;
    }
  }, {
    key: 'unbindBuffer',
    value: function unbindBuffer(_ref4) {
      var index = _ref4.index;

      this.gl.bindTransformFeedback(GL_TRANSFORM_FEEDBACK, this.handle);
      this.gl.bindBufferBase(GL_TRANSFORM_FEEDBACK_BUFFER, index, null);
      return this;
    }

    // PRIVATE METHODS

    // See https://github.com/KhronosGroup/WebGL/issues/2346
    // If it was true that having a buffer on an unused TF was a problem
    // it would make the entire concept of transform feedback objects pointless.
    // The whole point of them is like VertexArrayObjects.
    // You set them up with all in outputs at init time and
    // then in one call you can setup all the outputs just before drawing.
    // Since the point of transform feedback is to generate data that will
    // then be used as inputs to attributes it makes zero sense you'd
    // have to unbind them from every unused transform feedback object
    // before you could use them in an attribute. If that was the case
    // there would be no reason to setup transform feedback objects ever.
    // You'd always use the default because you'd always have to bind and
    // unbind all the buffers.

  }, {
    key: '_bindBuffers',
    value: function _bindBuffers() {
      for (var bufferIndex in this.buffers) {
        this.bindBuffer({ buffer: this.buffers[bufferIndex], index: Number(bufferIndex) });
      }
    }
  }, {
    key: '_unbindBuffers',
    value: function _unbindBuffers() {
      for (var bufferIndex in this.buffers) {
        this.unbindBuffer({ buffer: this.buffers[bufferIndex], index: Number(bufferIndex) });
      }
    }

    // RESOURCE METHODS

  }, {
    key: '_createHandle',
    value: function _createHandle() {
      return this.gl.createTransformFeedback();
    }
  }, {
    key: '_deleteHandle',
    value: function _deleteHandle() {
      this.gl.deleteTransformFeedback(this.handle);
    }
  }]);

  return TranformFeedback;
}(Resource);

// Counts the number of complete "primitives" given a number of vertices and a drawMode


export default TranformFeedback;
export function getPrimitiveCount(_ref5) {
  var drawMode = _ref5.drawMode,
      vertexCount = _ref5.vertexCount,
      countVertices = _ref5.countVertices;

  switch (drawMode) {
    case GL.POINTS:
      return vertexCount;
    case GL.LINES:
      return vertexCount / 2;
    case GL.LINE_STRIP:
      return vertexCount - 1;
    case GL.LINE_LOOP:
      return vertexCount;
    case GL.TRIANGLES:
      return vertexCount / 3;
    case GL.TRIANGLE_STRIP:
      return vertexCount - 2;
    case GL.TRIANGLE_FAN:
      return vertexCount - 2;
    default:
      assert(false);return 0;
  }
}

// Counts the number of vertices after splitting the vertex stream into separate "primitives"
export function getVertexCount(_ref6) {
  var drawMode = _ref6.drawMode,
      vertexCount = _ref6.vertexCount;

  var primitiveCount = getPrimitiveCount({ drawMode: drawMode, vertexCount: vertexCount });
  switch (drawMode) {
    case GL.POINTS:
      return primitiveCount;
    case GL.LINES:
    case GL.LINE_STRIP:
    case GL.LINE_LOOP:
      return vertexCount * 2;
    case GL.TRIANGLES:
    case GL.TRIANGLE_STRIP:
    case GL.TRIANGLE_FAN:
      return vertexCount * 3;
    default:
      assert(false);return 0;
  }
}

// Counts the number of complete primitives given a number of vertices and a drawMode
export function getTransformFeedbackMode(_ref7) {
  var drawMode = _ref7.drawMode;

  switch (drawMode) {
    case GL.POINTS:
      return GL.POINTS;
    case GL.LINES:
      return GL.LINES;
    case GL.LINE_STRIP:
      return GL.LINES;
    case GL.LINE_LOOP:
      return GL.LINES;
    case GL.TRIANGLES:
      return GL.TRIANGLES;
    case GL.TRIANGLE_STRIP:
      return GL.TRIANGLES;
    case GL.TRIANGLE_FAN:
      return GL.TRIANGLES;
    default:
      assert(false);return 0;
  }
}
//# sourceMappingURL=transform-feedback.js.map