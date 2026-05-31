import { describe, it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import { flatMap, pipe, repeat, toArray } from '.';

describe('flatMap', () => {
  it('matches native flatMap behavior on nested arrays', async function () {
    const a = [1, 2, [3]].flatMap(n => n);
    equal([...flatMap([1, 2, [3]], n => n)], a);
  });

  it('adds dots either side of each number', async function () {
    function dotsEitherSide(n: number[]) {
      return flatMap(n, n => [n - 0.1, n, n + 0.1]);
    }
    equal(expectType<number[]>([...dotsEitherSide([1, 2, 3])]), [0.9, 1, 1.1, 1.9, 2, 2.1, 2.9, 3, 3.1]);
  });

  it('repeats each number n times', async function () {
    function repeatNums(n: number[]) {
      return flatMap(n, n => repeat(n, n));
    }
    equal([...repeatNums([1, 2, 3])], [1, 2, 2, 3, 3, 3]);
  });

  it('flattens characters from multiple strings', async function () {
    function chars(...strings: string[]) {
      return flatMap(strings, str => [...str]);
    }
    equal(expectType<string[]>([...chars('abc', 'def')]), ['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('spreads string elements from single-element array', async function () {
    equal([...flatMap(['123'], str => str)], ['123']);
  });

  it('maps string to char and charCode pairs via pipe', async function () {
    equal(
      pipe(
        'abcde',
        flatMap(str => [str, str.charCodeAt(0)]),
        toArray,
        expectType<(string | number)[]>,
      ),
      ['a', 97, 'b', 98, 'c', 99, 'd', 100, 'e', 101],
    );
  });

  it('infers mixed number string buffer iterator type', async function () {
    expectType<IterableIterator<number | string | Buffer>>(flatMap([1, 2, 3], n => [n, n.toString(), Buffer.from('')]));
  });
});
