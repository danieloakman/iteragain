import { Range } from './range';

/**
 * Creates an infinite iterator that returns numbers starting from `start` with `step` added to each iteration.
 * @param start The number to start from (default: 0).
 * @param step The number to add to each iteration (default: 1)
 */
export function count(start = 0, step = 1) {
  return new Range(start, Infinity, step);
}

export default count;
