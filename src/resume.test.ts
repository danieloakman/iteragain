import { it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import { map, pipe, range, resume } from '.';
it('resume', async function () {
  let it = resume(range(2), 1);
  equal([...it, ...it, ...it], [0, 1, 0, 1]);
  it = resume(range(2));
  equal([...it], [0, 1]);
  const it2 = pipe(
    [5, 8, 13],
    map(n => n.toString()),
    resume(1),
    v => {
      expectType<IterableIterator<string>>(v);
      return v;
    },
  );
  equal([...it2, ...it2, ...it2], ['5', '8', '13', '5', '8', '13']);
});
