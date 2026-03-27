import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { enumerate } from '.';
it('enumerate', async function () {
  equal(
    [...enumerate([{ a: 1 }, { b: 2 }])],
    [
      [0, { a: 1 }],
      [1, { b: 2 }],
    ],
  );
});
