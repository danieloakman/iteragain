import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { count, dropWhile, pipe, range, take } from '.';

describe('dropWhile', () => {
  it('drops elements while predicate is true', async function () {
    equal([...dropWhile(range(10), n => n < 5)], [5, 6, 7, 8, 9]);
  });

  it('drops first ten count elements then takes five via pipe', async function () {
    equal(
      pipe(
        count(),
        dropWhile(n => n < 10),
        take(5),
      ),
      [10, 11, 12, 13, 14],
    );
    // const a = toArray(dropWhile(range(10), n => n < 10));
    //    ^?
  });
});
