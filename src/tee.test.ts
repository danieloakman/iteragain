import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { iter, pipe, range, tee, toArray, zip } from '..';
it('tee', async function () {
  // this.timeout(60000);
  let [a, b] = tee([1, 2, 3], 2).map(v => iter(v));
  a = a.map(x => x * x);
  b = b.map(x => x + x);
  equal(a.take(), [1]);
  equal(b.take(2), [2, 4]);
  equal(a.toArray(), [4, 9]);
  equal(b.toArray(), [6]);
  equal([...tee([1, 2, 3], 1)[0]], [1, 2, 3]);
  equal(
    pipe(range(3), tee(3), ([it1, it2, it3]) => zip(it3, it2, it1), toArray),
    [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
  );
  // const suite = setupSuite('tee');
  // const SIZE = 1e1;
  // suite.add('no clear', () => {
  //   const [a, b] = range(SIZE).tee(2);
  //   a.map(x => x * x).toArray();
  //   b.map(x => x + x).toArray();
  // });
  // suite.add('clear', () => {
  //   const [a, b] = range(SIZE).tee(2, true);
  //   a.map(x => x * x).toArray();
  //   b.map(x => x + x).toArray();
  // });
  // suite.add('no clear, parallel', () => {
  //   let [a, b] = range(SIZE).tee(2);
  //   a = a.map(x => x * x);
  //   b = b.map(x => x + x);
  //   while (true) {
  //     const values: any[] = [];
  //     for (const i of [a, b])
  //       values.push(i.yield());
  //     if (values.every(v => v === undefined)) break;
  //   }
  // });
  // suite.add('clear, parallel', () => {
  //   let [a, b] = range(SIZE).tee(2, true);
  //   a = a.map(x => x * x);
  //   b = b.map(x => x + x);
  //   while (true) {
  //     const values: any[] = [];
  //     for (const i of [a, b])
  //       values.push(i.yield());
  //     if (values.every(v => v === undefined)) break;
  //   }
  // });
  // suite.run();
});
