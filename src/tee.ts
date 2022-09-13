import SeekableIterator from './internal/SeekableIterator';
import TeedIterator from './internal/TeedIterator';
import { IteratorOrIterable, Tuple } from './internal/types';
import toIterator from './toIterator';

/**
 * Returns `n` independent iterators, each of which is a copy of the input iterator at the time of calling `tee`. Once
 * `tee` has made a split, do not modify or call upon the original iterator, as the new iterators will not be
 * updated/informed.
 * This caches the original iterator's values as the new iterators are iterated through. So
 * depending on the size of the original iterator, there could be significant memory overhead in using `tee`.
 * `tee`'s intended use is to iterate over the returned iterators in parallel, or at least somewhat in parallel. In
 * general, if one returned iterator consumes most or all of it's values, then it is faster to just
 * use `toArray` and then iterate over that.
 * @param n The number of independent iterators to create.
 */
export function tee<T, N extends number>(arg: IteratorOrIterable<T>, n: N): Tuple<IterableIterator<T>, N> {
  const seekable = new SeekableIterator(toIterator(arg));
  const indices = new Array(n).fill(0);
  return Array.from({ length: n }, (_, i) => new TeedIterator(i, seekable, indices)) as Tuple<IterableIterator<T>, N>;
}

export default tee;
