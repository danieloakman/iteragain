import CycleIterator from './internal/CycleIterator';
import ExtendedIterator from './internal/ExtendedIterator';
import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Creates an iterator that cycles through the input iterator's values a certain number of times.
 * @param arg The input iterator.
 * @param times The number of times to cycle through the input iterator's values (default: Infinity).
 */
export function cycle<T>(arg: IteratorOrIterable<T>, times = Infinity): ExtendedIterator<T> {
  return new ExtendedIterator(new CycleIterator(toIterator(arg), times));
}

export default cycle;