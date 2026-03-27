import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { count, dropWhile, pipe, range, take } from '.';
it('dropWhile', async function () {
  equal([...dropWhile(range(10), n => n < 5)], [5, 6, 7, 8, 9]);
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
