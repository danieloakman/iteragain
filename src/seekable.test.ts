import { describe, it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import type SeekableIterator from './internal/SeekableIterator';
import { count, filter, pipe, range, seekable } from '.';

describe('seekable', () => {
  it('should support seek, peek, and elements on a buffered iterator', async function () {
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
  });

  it('should return undefined when seeking on an empty iterator', async function () {
    const empty = seekable([]);
    equal(empty.seek(10), undefined);
  });

  it('should work with filtered infinite sequences', async function () {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
      return true;
    };
    const primes = pipe(count(), filter(isPrime), seekable(100));
    expectType<SeekableIterator<number>>(primes);
    primes.seek(5);
    equal(primes.next().value, 13);
  });

  it('should return undefined when seeking past the end in a pipe', async function () {
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

  it('should preserve undefined values when seeking', async function () {
    const it = seekable([undefined, 1, undefined]);
    equal([it.next().value, it.next().value, it.next().value, it.next().value], [undefined, 1, undefined, undefined]);
    it.seek(0);
    equal([it.next().value, it.next().value, it.next().value], [undefined, 1, undefined]);
  });

  it('should seek relative to the buffer window', async function () {
    const it = seekable(range(10), 3);
    equal([it.next().value, it.next().value, it.next().value, it.next().value], [0, 1, 2, 3]);
    for (let i = 4; i < 6; i++) it.next();
    equal(it.elements, [3, 4, 5]);
    it.seek(0);
    equal([it.next().value, it.next().value, it.next().value], [3, 4, 5]);
    it.seek(-1);
    equal(it.peek(), [5]);
    equal(it.next().value, 5);
  });

  it('should seek to the start of the buffer after partial consumption', async function () {
    const it = seekable(range(10), 2);
    it.next();
    it.next();
    it.next();
    it.seek(0);
    equal([it.next().value, it.next().value], [1, 2]);
  });
});
