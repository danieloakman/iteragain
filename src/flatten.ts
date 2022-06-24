import ExtendedIterator from './ExtendedIterator';
import { IteratorOrIterable, FlattenDeep, FlattenDepth1 } from './types';
import isIterable from './isIterable';
import isIterator from './isIterator';
import toIterator from './toIterator';

function* flattenGen<T>(arg: IteratorOrIterable<T>, depth: number) {
  const iterator = toIterator(arg);
  let next: IteratorResult<any>;
  if (depth === 0) {
    while (!(next = iterator.next()).done) yield next.value;
    return;
  }
  while (!(next = iterator.next()).done) {
    if (isIterable(next.value) || isIterator(next.value)) yield* flattenGen(next.value, depth - 1);
    else yield next.value;
  }
}

export function flatten<T>(arg: IteratorOrIterable<T>, depth: 1): ExtendedIterator<FlattenDepth1<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>): ExtendedIterator<FlattenDeep<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: number): ExtendedIterator<any>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth = Infinity) {
  return new ExtendedIterator(flattenGen(arg, depth));
}

export default flatten;
