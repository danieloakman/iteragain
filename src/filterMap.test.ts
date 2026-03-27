import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { filterMap, pipe, range, take, toArray } from '.';
it('filterMap', async function () {
  equal([...filterMap(range(10), n => (n % 2 === 0 ? n : null))], [0, 2, 4, 6, 8]);
  equal(
    pipe(
      range(10),
      filterMap(n => (n > 4 ? n.toString() : undefined)),
      take(3),
    ),
    ['5', '6', '7'],
  );
  // const a = toArray(filterMap([1, 2, 3, null, ''], n => n));
  //    ^?
});
