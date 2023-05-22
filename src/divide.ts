import { IteratorOrIterable, Tuple } from './internal/types';
import toArray from './toArray';
import toIterator from './toIterator';

/**
 * Divide the elements from `arg` into `n` parts, maintaining order. Note, this method will fully iterate through `arg`
 * before returning a result. If you don't want this behavior and don't care about order then use `distribute` instead.
 */
export function divide<T, Size extends number>(arg: IteratorOrIterable<T>, n: Size): Tuple<IterableIterator<T>, Size> {
  const array = toArray(arg);
  const result: IterableIterator<T>[] = [];
  const quotient = Math.floor(array.length / n);
  const remainder = array.length % n;
  let stop = 0;
  let start = 0;
  for (let i = 1; i < n + 1; i++) {
    start = stop;
    stop += i <= remainder ? quotient + 1 : quotient;
    result.push(
      Object.assign(toIterator(array.slice(start, stop)), {
        [Symbol.iterator]() {
          return this;
        },
      }) as IterableIterator<T>,
    );
  }
  return result as Tuple<IterableIterator<T>, Size>;
}

export default divide;
