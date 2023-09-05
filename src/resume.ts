import ResumeIterator from './internal/ResumeIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Resumes the input iterator a certain number of times after it's next value returns `{ done: true }`.
 * @param times The number of times to resume the iterator (default: Infinity).
 * @example
 * const it = iter([1,2,3]).resume(1);
 * equal([...it], [1,2,3]);
 * equal([...it], [1,2,3]);
 * equal([...it], []);
 */
export function resume<T extends IteratorOrIterable<any>>(times?: number): (arg: T) => IterableIterator<IterSource<T>>;
export function resume<T extends IteratorOrIterable<any>>(arg: T, times?: number): IterableIterator<IterSource<T>>;
export function resume(...args: any[]): ItOrCurriedIt<any> {
  if (!args.length || typeof args[0] === 'number') return it => resume(it, args[0]);
  return new ResumeIterator(toIterator(args[0]), args[1] ?? Infinity);
}

export default resume;
