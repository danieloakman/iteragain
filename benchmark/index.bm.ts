import { setupSuite } from './bm-util';

const suite = setupSuite(__filename.split(/[\\/]/).pop());
import ExtendedIterator from '../src/internal/ExtendedIterator';
import { IteratorWithOperators } from 'iterare/lib/iterate';
import { from } from 'rxjs';
import { map, filter/* , skip */ } from 'rxjs/operators';

function* nums(size: number) {
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
      map(n => n * n),
      filter(n => n % 2 !== 0),
      // filter(n => n > 100),
      // filter(n => n < 200),
      map(n => n.toString()),
    )
    .subscribe(() => {});
});

suite.run({
  async: true,
});
