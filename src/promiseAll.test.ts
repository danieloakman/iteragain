import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { iter, map, promiseAll, range, tee, toArray } from '..';
it('promiseAll', async function () {
  const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
  const [it1, it2] = tee(
    iter(range(10)).map(n => n * 10),
    2,
  );
  equal(await promiseAll(map(it1, sleep)), toArray(it2));
});
