import { IteratorOrIterable } from './types';
import spy from './spy';
import tee from './tee';
import map from './map';

/**
 * The inverse of `zip` and `zipLongest`. This function disaggregates the elements of the input iterator. The nth
 * iterator in the returned tuple contains the nth element of each value in the input iterator. The length of the
 * returned tuple is determined by the length of the first value in the input iterator.
 */
export function unzip<T extends any[]>(arg: IteratorOrIterable<T>): IterableIterator<T[number]>[] {
  const [[head], it] = spy(arg);
  const n = Array.isArray(head) ? head.length : 1;
  if (n < 2) return [it];
  return tee(it, n).map((it, i) => map(it, v => v[i]));
}

export default unzip;
