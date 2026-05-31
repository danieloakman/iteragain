import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { map, promiseRace } from '.';

describe('promiseRace', () => {
  it('should resolve with the fastest promise', async function () {
    const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
    equal(await promiseRace(map([20, 10, 30], sleep)), 10);
  });
});
