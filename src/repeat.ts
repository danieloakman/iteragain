import RepeatIterator from './internal/RepeatIterator';
import ExtendedIterator from './internal/ExtendedIterator';

/**
 * Repeats `value` a certain number of times.
 * @param value The value to repeat.
 * @param times The number of times to repeat `value` (default: Infinity).
 */
export function repeat<T>(value: T, times = Infinity): ExtendedIterator<T> {
  return new ExtendedIterator(new RepeatIterator(value, times));
}

export default repeat;
