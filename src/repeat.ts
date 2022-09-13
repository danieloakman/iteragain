import RepeatIterator from './internal/RepeatIterator';

/**
 * Repeats `value` a certain number of times.
 * @param value The value to repeat.
 * @param times The number of times to repeat `value` (default: Infinity).
 */
export function repeat<T>(value: T, times = Infinity) {
  return new RepeatIterator(value, times);
}

export default repeat;
