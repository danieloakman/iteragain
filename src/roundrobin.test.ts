import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { roundrobin } from '.';
it('roundrobin', async function () {
  equal([...roundrobin([1, 2, 3], [4, 5, 6])], [1, 4, 2, 5, 3, 6]);
  equal([...roundrobin('ABC', 'D', 'EF')], ['A', 'D', 'E', 'B', 'F', 'C']);
});
