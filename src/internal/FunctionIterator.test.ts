import { describe, it } from 'bun:test';
import { equal } from './test-utils';
import { iter, range } from '..';
import FunctionIterator from './FunctionIterator';

describe('FunctionIterator', () => {
  it('should iterate function results up to limit and reset on re-iteration', async function () {
    const it = new FunctionIterator(
      (
        (n = 0) =>
        () =>
          n++ * 2
      )(),
      100 as const,
    );
    equal([...it], [...range(0, 100, 2)]);
    equal([...it], []);
  });

  it('should accumulate values passed to next on iter().map()', async function () {
    const it2 = iter(
      (
        (t = 0) =>
        (n?: number) => {
          if (typeof n === 'number') t += n;
          return t;
        }
      )(),
    ).map(n => n + 10);
    equal(it2.next(1).value, 11);
    equal(it2.next(2).value, 13);
    equal(it2.next(3).value, 16);
  });

  it('should accumulate values passed to next on generator iter', async function () {
    function* sum(): Generator<number> {
      let t = 0;
      while (true) {
        const n = yield t;
        if (typeof n === 'number') t += n;
      }
    }
    const it3 = iter(sum());
    equal(it3.next(0).value, 0);
    equal(it3.next(1).value, 1);
    equal(it3.next(2).value, 3);
    equal(it3.next(3).value, 6);
  });
});
