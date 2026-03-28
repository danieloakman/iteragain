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

  it('concurrency 1', async () => {
    let active = 0;
    let maxActive = 0;
    const n = 4;
    const ms = 100;
    const sleep = (ms: number): Promise<number> =>
      new Promise(resolve => {
        active++;
        maxActive = Math.max(maxActive, active);
        setTimeout(() => {
          active--;
          resolve(ms);
        }, ms);
      });
    const expected = iter(range(n)).map(() => ms).toArray();
    const it = iter(range(n)).map(() => sleep(ms));
    const result = await promiseAll(it, { concurrency: 1 });
    expect(result).toEqual(expected);
    expect(maxActive).toBe(1);
  });

  it('concurrency 2', async () => {
    let active = 0;
    let maxActive = 0;
    const n = 4;
    const ms = 100;
    const sleep = (ms: number): Promise<number> =>
      new Promise(resolve => {
        active++;
        maxActive = Math.max(maxActive, active);
        setTimeout(() => {
          active--;
          resolve(ms);
        }, ms);
      });
    const expected = iter(range(n)).map(() => ms).toArray();
    const it = iter(range(n)).map(() => sleep(ms));
    const result = await promiseAll(it, { concurrency: 2 });
    expect(result).toEqual(expected);
    expect(maxActive).toBe(2);
  });
});