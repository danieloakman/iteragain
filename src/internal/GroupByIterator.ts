import { Iteratee, KeyIdentifier } from './types';

type Value<T, K extends KeyIdentifier<T>> = K extends keyof T ? T[K] : K extends Iteratee<T, any> ? ReturnType<K> : never;
// T extends KeyIdentifier<infer U>
//   ? U extends (...args: any[]) => infer V ? V : U extends keyof T ? T[U] : never
//   : never;

// type a = Value<>

export class GroupByIterator<T, K extends KeyIdentifier<T>> implements IterableIterator<[Value<T, K>, T[]]> {
  protected currKey: Value<T, K>;
  protected currGroup: T[] = [];
  protected done = false;

  constructor(protected iterator: Iterator<T>, protected key: K = (v => v) as any) {}

  [Symbol.iterator](): IterableIterator<[Value<T, K>, T[]]> {
    return this;
  }

  next(): IteratorResult<[Value<T, K>, T[]]> {
    if (this.done) return { done: true, value: undefined };

    let next: IteratorResult<T>;
    if (typeof this.currKey !== 'string') {
      next = this.iterator.next();
      if (next.done) {
        this.done = true;
        return { done: true, value: undefined };
      }
      this.currKey = this.getKey(next.value);
      this.currGroup.push(next.value);
    }

    while (!(next = this.iterator.next()).done) {
      this.currGroup.push(next.value);
      const nextKey = this.getKey(next.value);
      if (nextKey !== this.currKey) {
        const value: [Value<T, K>, T[]] = [this.currKey, this.currGroup.splice(0, this.currGroup.length - 1)];
        this.currKey = nextKey;
        return { done: false, value };
      }
    }

    this.done = true;
    return { done: true, value: [this.currKey, this.currGroup] };
  }

  getKey(value: T): Value<T, K> {
    return typeof this.key === 'function' ? this.key(value) : (value as any)[this.key];
  }
}

export default GroupByIterator;

import toIterator from '../toIterator';
const a = [...new GroupByIterator(toIterator('abc'))];