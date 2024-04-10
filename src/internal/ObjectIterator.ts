import type { ObjectEntry } from '../types';
import ConcatIterator from './ConcatIterator';
import RepeatIterator from './RepeatIterator';

/**
 * Iterates through all keys in an object. Optionally provides traversal order. Does not support circular references and
 * will throw a RangeError with max call stack exceeded.
 * @todo // TODO: Add support for BFS traversal order.
 */
export class ObjectIterator<T extends Record<PropertyKey, any>> implements IterableIterator<ObjectEntry> {
  protected inner: Iterator<ObjectEntry> | null = null;
  protected arr: ObjectEntry[] = [];

  constructor(
    object: T,
    protected traversal: 'post-order-DFS' | 'pre-order-DFS' | 'BFS' = 'post-order-DFS',
  ) {
    this.push(object);
  }

  [Symbol.iterator](): IterableIterator<ObjectEntry> {
    return this;
  }

  public next(...args: any[]): IteratorResult<ObjectEntry> {
    if (this.inner) {
      const next = this.inner.next(...(args as any));
      if (!next.done) return next;
      this.inner = null;
      return this.next(...(args as any));
    }
    if (!this.arr.length) return { done: true, value: undefined };
    const next = this.arr.shift() as ObjectEntry; // Previous line ensures this is not undefined.
    if (this.isObject(next[1])) {
      this.inner = new ConcatIterator(
        this.traversal === 'post-order-DFS'
          ? [new ObjectIterator(next[1]), new RepeatIterator(next, 1)]
          : [new RepeatIterator(next, 1), new ObjectIterator(next[1])],
      );
      return this.next(...(args as any));
    }
    return { value: next, done: false };
  }

  protected isObject(value: any): value is NonNullable<object> {
    return typeof value === 'object' && value !== null;
  }

  protected push(obj: any) {
    for (const key of Object.keys(obj)) this.arr.push([key, obj[key], obj]);
  }
}

export default ObjectIterator;
