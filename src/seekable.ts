import type { IterSource, IteratorOrIterable } from './types';
import SeekableIterator from './internal/SeekableIterator';
import toIterator from './toIterator';

/**
 * Wraps the input iterator to allow for seeking backwards and forwards through its values. An internal cache of length
 * `maxLength` is kept and progressively added to when iterating forwards.
 */
export function seekable<T>(maxLength?: number): (arg: IteratorOrIterable<T>) => SeekableIterator<T>;
export function seekable<T extends IteratorOrIterable<any>>(arg: T, maxLength?: number): SeekableIterator<IterSource<T>>;
export function seekable<T>(...args: any[]): SeekableIterator<any> | ((arg: IteratorOrIterable<T>) => SeekableIterator<T>) {
  if (!args.length || typeof args[0] === 'number') return it => seekable(it, args[0]);
  return new SeekableIterator(toIterator(args[0]), args[1]);
}

export default seekable;
