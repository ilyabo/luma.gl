import {experimental, Buffer} from 'luma.gl';
import 'luma.gl/headless';
import test from 'tape-catch';
import {fixture} from '../../setup';

const {BufferMap} = experimental;
const VS = `\
#version 300 es
attribute float inValue;
varying float outValue;

void main()
{
  outValue = 2.0 * inValue;
}
`;

test('WebGL#BufferMap constructor/delete', t => {
  const {gl, gl2} = fixture;

  t.throws(
    () => new BufferMap(),
    /.*Requires WebGL2.*/,
    'Buffer throws on missing gl context');

  t.throws(
    () => new BufferMap(gl),
    /.*Requires WebGL2.*/,
    'Buffer throws on missing gl context');

  if (!gl2) {
    t.comment('WebGL2 not available, skipping tests');
    t.end();
    return;
  }

  const sourceData = new Float32Array([10, 20, 31, 0, -57]);
  const sourceBuffer = new Buffer(gl2, {data: sourceData});

  const bufferMap = new BufferMap(gl2, {
    sourceBuffers: {
      inValue: sourceBuffer
    },
    vs: VS,
    sourceDestinationMap: {
      inValue: 'outValue'
    },
    varyings: ['outValue'],
    elementCount: 5
  });

  t.ok(bufferMap instanceof BufferMap, 'BufferMap construction successful');

  bufferMap.delete();
  t.ok(bufferMap instanceof BufferMap, 'BufferMap delete successful');

  bufferMap.delete();
  t.ok(bufferMap instanceof BufferMap, 'BufferMap repeated delete successful');

  t.end();
});

test('WebGL#BufferMap run', t => {
  const {gl2} = fixture;

  if (!gl2) {
    t.comment('WebGL2 not available, skipping tests');
    t.end();
    return;
  }

  const sourceData = new Float32Array([10, 20, 31, 0, -57]);
  const sourceBuffer = new Buffer(gl2, {data: sourceData});

  const bufferMap = new BufferMap(gl2, {
    sourceBuffers: {
      inValue: sourceBuffer
    },
    vs: VS,
    sourceDestinationMap: {
      inValue: 'outValue'
    },
    varyings: ['outValue'],
    elementCount: 5
  });

  bufferMap.run();

  const expectedData = sourceData.map(x => x * 2);
  const outData = bufferMap.getBuffer('outValue').getData();

  t.deepEqual(expectedData, outData, 'BufferMap.getData: is successful');

  t.end();
});

test('WebGL#BufferMap swapBuffers', t => {
  const {gl2} = fixture;

  if (!gl2) {
    t.comment('WebGL2 not available, skipping tests');
    t.end();
    return;
  }

  const sourceData = new Float32Array([10, 20, 31, 0, -57]);
  const sourceBuffer = new Buffer(gl2, {data: sourceData});

  const bufferMap = new BufferMap(gl2, {
    sourceBuffers: {
      inValue: sourceBuffer
    },
    vs: VS,
    sourceDestinationMap: {
      inValue: 'outValue'
    },
    varyings: ['outValue'],
    elementCount: 5
  });

  bufferMap.run();

  bufferMap.swapBuffers();
  bufferMap.run();

  const expectedData = sourceData.map(x => x * 4);
  const outData = bufferMap.getBuffer('outValue').getData();

  t.deepEqual(expectedData, outData, 'BufferMap.getData: is successful');

  t.end();
});
