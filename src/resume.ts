import ResumeIterator from './internal/ResumeIterator';
import { IteratorOrIterable } from './types';
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
export function resume<T>(arg: IteratorOrIterable<T>, times = Infinity): IterableIterator<T> {
  return new ResumeIterator(toIterator(arg), times);
}

export default resume;
