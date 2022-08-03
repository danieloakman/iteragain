import { ObjectEntry } from './types';
import ConcatIterator from './ConcatIterator';
import RepeatIterator from './RepeatIterator';

/**
 * Iterates through all keys in an object. Optionally provides traversal order.
 * @todo // TODO: Add support for other traversal orders.
 */
export class ObjectIterator<T extends Record<PropertyKey, any>> implements IterableIterator<ObjectEntry> {
  protected inner: Iterator<ObjectEntry> = null;
  protected arr: ObjectEntry[] = [];

  constructor(object: T, protected traversal: 'post-order-DFS' | 'pre-order-DFS' | 'BFS' = 'post-order-DFS') {
    this.push(object);
  }

  [Symbol.iterator](): IterableIterator<ObjectEntry> {
    return this;
  }

  public next(): IteratorResult<ObjectEntry> {
    if (this.inner) {
      const next = this.inner.next();
      if (!next.done) return next;
      this.inner = null;
      return this.next();
    }
    if (this.arr.length) {
      const next = this.arr.shift();
      if (this.isObject(next[1])) {
        this.inner = new ConcatIterator([
          new ObjectIterator(next[1]),
          new RepeatIterator(next, 1),
        ]);
        return this.next();
      }
      return { value: next, done: false };
    }
    return { done: true, value: undefined };
  }

  protected isObject(value: any): value is NonNullable<object> {
    return typeof value === 'object' && value !== null;
  }

  protected push(obj: any) {
    for (const key of Object.keys(obj)) this.arr.push([key, obj[key], obj]);
  }

  protected unshift(obj: any) {
    for (const key of Object.keys(obj)) this.arr.unshift([key, obj[key], obj]);
  }
}

export default ObjectIterator;
