import GL from './gl-constants';
import Resource from './resource';
import Buffer from './buffer';
import TransformFeedback from './transform-feedback';
import Model from './../core/model';
import {isWebGL2, assertWebGL2Context} from './context';
import assert from 'assert';

// TODO: append 'version' only if VS has it.
const DEFAULT_FS = `\
#version 300 es
void main()
{
}
`;

export default class GPUBufferMap extends Resource {

  static isSupported(gl) {
    // For now WebGL2 only
    return isWebGL2(gl);
  }

  constructor(gl, opts = {}) {
    assertWebGL2Context(gl);
    super(gl, opts);

    this.model = null;
    this.buffersSwapable = false;
    this.currentIndex = 0;
    this.sourceBuffers = new Array(2);
    this.destinationBuffers = new Array(2);
    this.vertexArrays = new Array(2);
    this.transformFeedbacks = new Array(2);
    this.elementCount = 0;

    this.initialize(opts);
    Object.seal(this);
  }

  // TODO: Fix super class, it shouldn't be Resource
  _createHandle() {
  }

  _deleteHandle() {
    // TODO: Delete all resources, source buffers, destination buffers, TF and Model
  }

  _getOptsFromHandle() {
  }

  _getParameter(pname, opts) {
  }

  initialize({
    sourceBuffers = null,
    destinationBuffers = null,
    vs = null,
    sourceDestinationMap = null,
    varyings = null,
    drawMode = GL.POINTS,
    elementCount = null
  }) {
    assert(sourceBuffers && vs && varyings && elementCount);

    this.buffersSwapable = !destinationBuffers && sourceDestinationMap;

    this.bindBuffers({sourceBuffers, destinationBuffers, sourceDestinationMap});

    let index = 0;
    this.varyings = [];
    this.varyingMap = {};
    for (const varying of varyings) {
      this.varyings[index] = varying;
      this.varyingMap[varying] = index;
      index++;
    }

    for (let i = 0; i < 2; i++) {
      this.transformFeedbacks[i] = new TransformFeedback(this.gl, {
        buffers: this.destinationBuffers[i],
        varyingMap: this.varyingMap
      });
    }

    this.model = new Model(this.gl, {
      vs,
      fs: DEFAULT_FS,
      varyings: this.varyings,
      drawMode,
      vertexCount: elementCount
    });
  }

  bindBuffers({
    sourceBuffers = null,
    destinationBuffers = null,
    sourceDestinationMap = null
  }) {

    this.sourceBuffers[0] = {};
    for (const bufferName in sourceBuffers) {
      assert(sourceBuffers[bufferName] instanceof Buffer);
      this.sourceBuffers[0][bufferName] = sourceBuffers[bufferName];
    }

    this.destinationBuffers[0] = {};
    for (const bufferName in destinationBuffers) {
      assert(destinationBuffers[bufferName] instanceof Buffer);
      this.destinationBuffers[0][bufferName] = destinationBuffers[bufferName];
    }

    if (this.buffersSwapable) {
      this.sourceBuffers[1] = {};
      this.destinationBuffers[1] = {};
    }

    for (const sourceBufferName in sourceDestinationMap) {
      const destinationBufferName = sourceDestinationMap[sourceBufferName];
      if (!this.destinationBuffers[0][destinationBufferName]) {
        const sourceBuffer = this.sourceBuffers[0][sourceBufferName];
        // Create new buffer with same layout and settings as source buffer
        const {bytes, type, usage, layout} = sourceBuffer;
        this.destinationBuffers[0][destinationBufferName] =
          new Buffer(this.gl, {bytes, type, usage, layout});
      }

      if (this.buffersSwapable) {
        this.sourceBuffers[1][sourceBufferName] =
          this.destinationBuffers[0][destinationBufferName];
        this.destinationBuffers[1][destinationBufferName] =
          this.sourceBuffers[0][sourceBufferName];
      }
    }

    return this;
  }

  run({uniforms = {}} = {}) {
    this.model.setAttributes(this.sourceBuffers[this.currentIndex]);
    this.model.draw({
      transformFeedback: this.transformFeedbacks[this.currentIndex],
      uniforms,
      parameters: {
        [GL.RASTERIZER_DISCARD]: true
      }
    });
  }

  swapBuffers() {
    assert(this.buffersSwapable);
    this.currentIndex = (this.currentIndex + 1) % 2;
  }

  getBuffer(varyingName = null) {
    assert(varyingName && this.destinationBuffers[this.currentIndex][varyingName]);
    return this.destinationBuffers[this.currentIndex][varyingName];
  }
}
