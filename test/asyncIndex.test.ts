import { ok as assert, deepStrictEqual as equal } from 'assert';
import asyncIter from '../src/asyncIter';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function* randAsyncGen(size: number, sleepMultiplier = 100) {
  for (let i = 0; i < size; i++) {
    // await sleep(Math.random() * sleepMultiplier);
    yield i;
  }
}

describe('asyncIter', async function () {
  it('toArray', async function () {
    equal(await asyncIter(randAsyncGen(10, 10)).toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('map', async function () {
    equal(await asyncIter(randAsyncGen(5, 10)).map(v => v * v).toArray(), [0, 1, 4, 9, 16]);
  });
});
