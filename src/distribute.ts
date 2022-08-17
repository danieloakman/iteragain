import { IteratorOrIterable, Tuple } from './internal/types';
import tee from './tee';
import count from './count';
import compress from './compress';
import map from './map';

/**
 * Distributes `arg` among `n` amount of smaller iterators. Does not maintain order so if order is important, use
 * `divide` instead.
 */
export function distribute<T, Size extends number>(
  arg: IteratorOrIterable<T>,
  n: Size,
): Tuple<IterableIterator<T>, Size> {
  return tee(arg, n).map((it, i) =>
    compress(
      it,
      map(count(), v => (v - i) % n === 0),
    ),
  ) as Tuple<IterableIterator<T>, Size>;
}

export default distribute;
