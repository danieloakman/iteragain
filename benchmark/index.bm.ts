import { setupSuite } from './bm-util';

// function getRandInt (min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const suite = setupSuite(__filename.split(/[\\/]/).pop());
// import { range, iterate, iterate2, ExtendedIterator, IteratorWithOperators } from '../../utils/iterutil';
import ExtendedIterator from '../src/ExtendedIterator';
import { IteratorWithOperators } from 'iterare/lib/iterate';
import { iterplus } from 'iterplus';

function* nums(size: number) {
  for (let i = 0; i < size; i++) yield i;
}

for (const size of [1e4/* , 1e5, 1e6 */]) {
  suite.add(`for of loop ${1e4}`, () => {
    const arr: string[] = [];
    for (const x of nums(size))
      arr.push((x * x).toString());
  });
  suite.add(`iteragain ${size}`, () => {
    new ExtendedIterator(nums(size))
      .map(x => x * x)
      // .filter(x => x % 2 !== 0)
      .map(x => x.toString())
      .toArray();
  });
  suite.add(`iterare ${size}`, () => {
    new IteratorWithOperators(nums(size))
      .map(x => x * x)
      // .filter(x => x % 2 !== 0)
      .map(x => x.toString())
      .toArray();
  });
  suite.add(`iterplus ${size}`, () => {
    iterplus(nums(size))
      .map(x => x * x)
      // .filter(x => x % 2 !== 0)
      .map(x => x.toString())
      .collect();
  });
}

suite.run({
  async: true,
});
