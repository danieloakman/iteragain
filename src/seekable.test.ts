import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import type SeekableIterator from './internal/SeekableIterator';
import { count, filter, pipe, range, seekable } from '..';
it('seekable', async function () {
  {
    const it = seekable(count(), 5);
    const toValues = <T extends IteratorResult<any>[]>(...itResults: T) => itResults.map(it => it.value);
    equal(toValues(it.next(), it.next(), it.next()), [0, 1, 2]);
    it.seek(0);
    equal(toValues(it.next(), it.next(), it.next()), [0, 1, 2]);
    equal(it.elements, [0, 1, 2]);
    equal(it.peek(), [it.next().value]);
    it.seek(10);
    equal(it.elements, [5, 6, 7, 8, 9]);
    it.seek(-1);
    equal(it.peek(), [9]);
  }
  {
    const empty = seekable([]);
    equal(empty.seek(10), undefined);
  }
  {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
      return true;
    };
    const primes = pipe(count(), filter(isPrime), seekable(100));
    expectType<SeekableIterator<number>>(primes);
    primes.seek(5);
    equal(primes.next().value, 13);
  }
  equal(
    pipe(
      range(10),
      seekable(1),
      v => (v.seek(100), v),
      v => v.next().value,
    ),
    undefined,
  );
});
