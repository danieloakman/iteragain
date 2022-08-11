import { IteratorOrIterable, Tuple } from './internal/types';
import tee from './tee';
import count from './count';
import compress from './compress';
import map from './map';

export function distribute<T, Size extends number>(
  arg: IteratorOrIterable<T>,
  n: Size,
): Tuple<IterableIterator<T>, Size> {
  const iterators = tee(arg, n);
  return Array.from({ length: n }, (_, i) =>
    compress(
      iterators[i],
      map(count(), v => ((v + i) % n === 0 ? 1 : 0)),
    ),
  ) as Tuple<IterableIterator<T>, Size>;
}

export default distribute;
