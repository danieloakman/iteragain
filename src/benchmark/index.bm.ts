import { setupSuite } from './bm-util';

const suite = setupSuite({ name: __filename.split(/[\\/]/).pop() });
import ExtendedIterator from '../internal/ExtendedIterator';
import { map, filter, toIterator, toArray } from '..';
import { IteratorWithOperators } from 'iterare/lib/iterate';
import { from } from 'rxjs';
import { map as rsjsMap, filter as rxjsFilter /* , skip */ } from 'rxjs/operators';
import * as ixIt from 'ix/iterable';
import * as ixOps from 'ix/iterable/operators';

function* nums(size: number): Generator<number> {
  for (let i = 0; i < size; i++) yield i;
}

const SIZE = 1e4;

// for (const { IterClass, name } of [
//   { IterClass: ExtendedIterator, name: 'iteragain' },
//   { IterClass: IteratorWithOperators, name: 'iterare' },
//   // { IterClass: IterPlus, name: 'iterplus' },
// ]) {
//   suite.add(name, () => {
//     new IterClass(nums(SIZE))
//       // .slice(0, SIZE / 2)
//       .map(n => n * n)
//       .filter(n => n % 2 !== 0)
//       // .filter(n => n > 100)
//       // .filter(n => n < 200)
//       .map(n => n.toString())
//       .toArray();
//   });
// }

suite.add('for of loop', () => {
  const arr: string[] = [];
  for (const num of nums(SIZE)) {
    const x = num * num;
    if (x % 2 !== 0) arr.push(x.toString());
  }
});
suite.add('iteragain', () => {
  new ExtendedIterator(nums(SIZE))
    .map(x => x * x)
    .filter(x => x % 2 !== 0)
    .map(x => x.toString())
    .toArray();
});
suite.add('iteragain standalones', () => {
  toArray(
    map(
      filter(
        map(toIterator(nums(SIZE)), x => x * x),
        x => x % 2 !== 0,
      ),
      x => x.toString(),
    ),
  );
});
suite.add('iterare', () => {
  new IteratorWithOperators(nums(SIZE))
    .map(x => x * x)
    .filter(x => x % 2 !== 0)
    .map(x => x.toString())
    .toArray();
});
suite.add('rxjs', () => {
  from(nums(SIZE))
    .pipe(
      // skip(SIZE / 2),
      rsjsMap(n => n * n),
      rxjsFilter(n => n % 2 !== 0),
      // filter(n => n > 100),
      // filter(n => n < 200),
      rsjsMap(n => n.toString()),
    )
    .subscribe(() => {});
});
suite.add('ixjs', () => {
  ixIt
    .from(nums(SIZE))
    .pipe(
      ixOps.map(n => n * n),
      ixOps.filter(n => n % 2 !== 0),
      ixOps.map(n => n.toString()),
    )
    .forEach(() => {});
});

// Testing that arrayLike saves time if the iterator is only partially iterated over:
// for (const size of [1e3, 1e4, 1e5, 1e6, 1e7]) {
//   suite.add(`arrayLike ${size}`, () => {
//     const arr = arrayLike(filter(map(nums(size), n => n * n), n => n % 2 !== 0));
//     for (const t of [size / 8, size / 4, size / 2, size]) {
//       const arr2 = take(arr, t);
//     }
//   });

//   suite.add(`array ${size}`, () => {
//     for (const t of [size / 8, size / 4, size / 2, size]) {
//       const arr = filter(map(nums(size), n => n * n), n => n % 2 !== 0);
//       const arr2 = take(arr, t);
//     }
//   });
// }

suite.run({
  async: true,
});
