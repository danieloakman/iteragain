import { concat } from './concat';
import { IteratorOrIterable } from './types';

export class ExtendedIterator<T> {
  protected readonly iterator: Iterator<T>;

  public constructor(iterator: Iterator<T>);
  public constructor(iterator: { iterator?: Iterator<any>; next?: () => IteratorResult<any> });
  public constructor(iterator: any) {
    this.iterator = iterator;
  }

  /** Returns a `{ value, done }` object that adheres to the Iterator protocol */
  public next() {
    return this.iterator.next();
  }

  /** Implements this as an Iterable so it's allowed to be used with "for of" loops. */
  public [Symbol.iterator]() {
    return this.iterator;
  }

  /** Returns a new ExtendedIterator that maps each element in this iterator to a new value. */
  public map<R>(iteratee: (value: T) => R) {
    return new ExtendedIterator<R>({
      iterator: this.iterator,
      next() {
        const { value, done } = this.iterator.next();
        return { value: done ? undefined : iteratee(value), done } as IteratorResult<R>;
      },
    });
  }

  /**
   * Returns a new ExtendedIterator that filters each element in this iterator.
   * @param predicate A function that returns a truthy value to indicate to keep that value.
   */
  public filter(predicate: (element: T) => any) {
    return new ExtendedIterator<T>({
      iterator: this.iterator,
      next() {
        let result: IteratorResult<T>;
        do result = this.iterator.next();
        while (!result.done && !predicate(result.value));
        return result;
      },
    });
  }

  /** Iterate over this iterator using the `array.protype.forEach` style of method. */
  public forEach(callback: (value: T) => void) {
    for (const value of this) callback(value);
  }

  /** Reduces this iterator to a single value. */
  public reduce(reducer: (accumulator: T, value: T) => T): T;
  public reduce<R>(reducer: (accumulator: R, value: T) => R, initialValue: R): R;
  public reduce<R>(reducer: (accumulator: R | T, value: T) => R, initialValue?: R): R {
    let accumulator = initialValue ?? this.iterator.next().value;
    for (const value of this) accumulator = reducer(accumulator, value);
    return accumulator;
  }

  public concat<A>(other: IteratorOrIterable<A>): ExtendedIterator<T | A>;
  public concat<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<T | A | B>;
  public concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any>
  public concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any> {
    return new ExtendedIterator(concat(this, ...args));
  }

  /**
   * Works like `Array.prototype.slice`, returns a new slice of this iterator.
   * @note This does not support negative `start` and `end` indices, as it's not possible to know the length of the
   * iterator while iterating.
   * @param start The index to start at (inclusive).
   * @param end The index to end at (exclusive).
   * @returns A new ExtendedIterator that only includes the elements between `start` and `end`.
   */
  public slice(start = 0, end = Infinity) {
    let i = 0;
    return new ExtendedIterator({
      iterator: this.iterator,
      next() {
        let result: IteratorResult<T>;
        while (!(result = this.iterator.next()).done && i++ < start);
        if (i <= end) return result;
        return { done: true, value: undefined };
      }
    });
  }

  /** Attaches the index to each value as a pair like: `[0, value], [1, value]`, etc. */
  public enumerate(): ExtendedIterator<[number, T]> {
    return this.map(((count = 0) => v => [count++, v])()); // prettier-ignore
  }

  /**
   * Take the first `n` elements from this iterator.
   * @param n The number of elements to take.
   */
  public take(n: number) {
    return this.slice(0, n);
  }

  public toArray(): T[] {
    const result: T[] = [];
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) result.push(next.value);
    return result;
  }

  public toSet() {
    return new Set(this.toArray());
  }

  public toMap<K, V>(this: ExtendedIterator<[K, V]>): Map<K, V> {
    return new Map<K, V>(this.toArray());
  }
}

export default ExtendedIterator;
