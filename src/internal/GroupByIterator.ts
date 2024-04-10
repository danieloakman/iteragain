import type { KeyIdentifiersValue, KeyIdentifier } from '../types';

/** Groups values in the input iterator by some key identifier function or property. */
export class GroupByIterator<T, K extends KeyIdentifier<T>>
  implements IterableIterator<[KeyIdentifiersValue<T, K>, T[]]>
{
  protected currKey: KeyIdentifiersValue<T, K> | undefined;
  protected currGroup: T[] = [];
  protected done = false;

  constructor(
    protected iterator: Iterator<T>,
    protected key: K,
  ) {}

  [Symbol.iterator](): IterableIterator<[KeyIdentifiersValue<T, K>, T[]]> {
    return this;
  }

  next(): IteratorResult<[KeyIdentifiersValue<T, K>, T[]]> {
    if (this.done) return { done: true, value: undefined };

    let next: IteratorResult<T>;
    if (this.currKey === undefined) {
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
        const value: [KeyIdentifiersValue<T, K>, T[]] = [
          this.currKey,
          this.currGroup.splice(0, this.currGroup.length - 1),
        ];
        this.currKey = nextKey;
        return { done: false, value };
      }
    }

    this.done = true;
    return { done: false, value: [this.currKey, this.currGroup] };
  }

  getKey(value: T): KeyIdentifiersValue<T, K> {
    return typeof this.key === 'function' ? this.key(value) : (value as any)[this.key];
  }
}

export default GroupByIterator;
