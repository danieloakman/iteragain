import { describe, it, expect } from 'bun:test';
import { equal } from './internal/test-utils';
import { iter, map, promiseAll, range, tee, toArray } from '.';

describe('promiseAll', () => {
  it('should return the results of the promises', async function () {
    const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
    const [it1, it2] = tee(
      iter(range(10)).map(n => n * 10),
      2,
    );
    equal(await promiseAll(map(it1, sleep)), toArray(it2));
  });

  it('concurrency', async () => {
    const ms = 2;
    for (const { concurrency, n } of [
      {
        concurrency: 1,
        n: 4,
      },
      {
        concurrency: 2,
        n: 4,
      },
      {
        concurrency: 3,
        n: 4,
      },
      {
        concurrency: 4,
        n: 4,
      },
      {
        concurrency: 5,
        n: 4,
      },
      {
        concurrency: Infinity,
        n: 10,
      },
    ]) {
      let active = 0;
      let maxActive = 0;
      const sleep = (ms: number): Promise<number> =>
        new Promise(resolve => {
          active++;
          maxActive = Math.max(maxActive, active);
          setTimeout(() => {
            active--;
            resolve(ms);
          }, ms);
        });
      const expected = iter(range(n))
        .map(() => ms)
        .toArray();
      const it = iter(range(n)).map(() => sleep(ms));
      const result = await promiseAll(it, { concurrency });
      expect(result).toEqual(expected);
      expect(maxActive).toBe(Math.min(concurrency, n));
    }
  });

  it('concurrency 0', () => {
    expect(() => promiseAll(iter(range(10)), { concurrency: 0 })).toThrow('Concurrency must be positive');
  });
});
