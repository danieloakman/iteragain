import type { IteratorOrIterable, Tuple } from './types';
import toArray from './toArray';
import toIterator from './toIterator';
import toIterableIterator from './toIterableIterator';

/**
 * Divide the elements from `arg` into `n` parts, maintaining order. Note, this method will fully iterate through `arg`
 * before returning a result. If you don't want this behavior and don't care about order then use `distribute` instead.
 */
export function divide<T, Size extends number>(arg: IteratorOrIterable<T>, n: Size): Tuple<IterableIterator<T>, Size>;
export function divide<T, Size extends number>(
  n: Size,
): (arg: IteratorOrIterable<T>) => Tuple<IterableIterator<T>, Size>;
export function divide(...args: any[]): any[] | ((arg: IteratorOrIterable<any>) => any[]) {
  if (args.length === 1) return it => divide(it, args[0]);
  const n = args[1];
  const array = toArray(args[0]);
  const result: IterableIterator<any>[] = [];
  const quotient = Math.floor(array.length / n);
  const remainder = array.length % n;
  let stop = 0;
  let start = 0;
  for (let i = 1; i < n + 1; i++) {
    start = stop;
    stop += i <= remainder ? quotient + 1 : quotient;
    result.push(toIterableIterator(toIterator(array.slice(start, stop))));
  }
  return result;
}

export default divide;
