import type { IteratorOrIterable, Tuple } from './types';
import tee from './tee';
import count from './count';
import compress from './compress';
import map from './map';

/**
 * Distributes `arg` among `n` amount of smaller iterators. Does not maintain order so if order is important, use
 * `divide` instead.
 * @example
 *  distribute(range(3), 3)].map(v => toArray(v)); // [[0], [1], [2]],
 *  distribute(range(6), 2)].map(v => toArray(v)); // [[0, 2, 4], [1, 3, 5]]
 */
export function distribute<T, Size extends number>(
  arg: IteratorOrIterable<T>,
  n: Size,
): Tuple<IterableIterator<T>, Size>;
export function distribute<T, Size extends number>(
  n: Size,
): (arg: IteratorOrIterable<T>) => Tuple<IterableIterator<T>, Size>;
export function distribute(
  ...args: any[]
): IterableIterator<any>[] | ((arg: IteratorOrIterable<any>) => IterableIterator<any>[]) {
  if (args.length === 1) return it => distribute(it, args[0]);
  const n = args[1];
  return tee(args[0], n).map((it, i) =>
    compress(
      it,
      map(count(), v => (v - i) % n === 0),
    ),
  );
}

export default distribute;
