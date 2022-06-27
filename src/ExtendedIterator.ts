import {
  IteratorOrIterable,
  FlattenDeep,
  FlattenDepth1,
  FlattenDepth2,
  FlattenDepth3,
  FlattenDepth4,
  FlattenDepth5,
} from './types';
import concat from './concat';
import flatten from './flatten';
import zip from './zip';
import zipLongest from './zipLongest';
import MapIterator from './internal/MapIterator';
import FilterIterator from './internal/FilterIterator';
import SliceIterator from './internal/SliceIterator';
import PairwiseIterator from './internal/PairwiseIterator';

export class ExtendedIterator<T> implements IterableIterator<T> {
  protected readonly iterator: Iterator<T>;

  public constructor(iterator: Iterator<T>) {
    this.iterator = iterator;
  }

  /** Returns a `{ value, done }` object that adheres to the Iterator interface. */
  public next() {
    return this.iterator.next();
  }

  /** Implements this as an Iterable so it's allowed to be used with "for of" loops. */
  public [Symbol.iterator]() {
    return this.iterator as IterableIterator<T>;
  }

  public toString() {
    return 'ExtendedIterator';
  }

  /** Returns a new ExtendedIterator that maps each element in this iterator to a new value. */
  public map<R>(iteratee: (value: T) => R): ExtendedIterator<R> {
    return new ExtendedIterator(new MapIterator(this.iterator, iteratee));
  }

  /**
   * Returns a new ExtendedIterator that filters each element in this iterator.
   * @param predicate A function that returns a truthy value to indicate to keep that value.
   */
  public filter(predicate: (element: T) => any): ExtendedIterator<T> {
    return new ExtendedIterator(new FilterIterator(this.iterator, predicate));
  }

  /** Iterate over this iterator using the `array.protype.forEach` style of method. */
  public forEach(callback: (value: T) => any) {
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
  public concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any>;
  public concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any> {
    return concat(this.iterator, ...args);
  }

  /**
   * Works like `Array.prototype.slice`, returns a new slice of this iterator.
   * @note This does not support negative `start` and `end` indices, as it's not possible to know the length of the
   * iterator while iterating.
   * @param start The index to start at (inclusive).
   * @param end The index to end at (exclusive).
   * @returns A new ExtendedIterator that only includes the elements between `start` and `end`.
   */
  public slice(start = 0, end = Infinity): ExtendedIterator<T> {
    return new ExtendedIterator(new SliceIterator(this.iterator, start, end));
  }

  /**
   * Flatten this iterator.
   * @param depth The number of levels to flatten (default: Infinity, i.e. deeply).
   */
  public flatten(depth: 1): ExtendedIterator<FlattenDepth1<T>>;
  public flatten(depth: 2): ExtendedIterator<FlattenDepth2<T>>;
  public flatten(depth: 3): ExtendedIterator<FlattenDepth3<T>>;
  public flatten(depth: 4): ExtendedIterator<FlattenDepth4<T>>;
  public flatten(depth: 5): ExtendedIterator<FlattenDepth5<T>>;
  public flatten(): ExtendedIterator<FlattenDeep<T>>;
  public flatten(depth: number): ExtendedIterator<any>;
  public flatten(depth = Infinity) {
    return flatten<T>(this, depth);
  }

  /** Return true if every element in this iterator matches the predicate. */
  public every(predicate: (value: T) => boolean): boolean {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (!predicate(next.value)) return false;
    return true;
  }

  /** Return true if only one element in this iterator matches the predicate. */
  public some(predicate: (value: T) => boolean): boolean {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (predicate(next.value)) return true;
    return false;
  }

  /** Attaches the index to each value as a pair like: `[0, value], [1, value]`, etc. */
  public enumerate(): ExtendedIterator<[number, T]> {
    return this.map(((count = 0) => v => [count++, v])()); // prettier-ignore
  }

  /** Aggregates this iterator and any number of others into one. Stops when one of the iterables is empty. */
  public zip<U>(other: IteratorOrIterable<U>): ExtendedIterator<[T, U]>;
  public zip<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[T, A, B]>;
  public zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
  public zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]> {
    return zip(this.iterator, ...args);
  }

  /** Aggregates this iterator and any number of others into one. Stops when all of the iterables is empty. */
  public zipLongest<U>(other: IteratorOrIterable<U>): ExtendedIterator<[T, U]>;
  public zipLongest<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[T, A, B]>;
  public zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
  public zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]> {
    return zipLongest(this.iterator, ...args);
  }

  /**
   * Return a new iterator of pairs (tuples) of the values in this one. The number of pairs will always be one fewer
   * than this iterator. Will be empty if this iterator has fewer than two values.
   * @example
   * iter([1,2,3]).pairwise().toArray() // [[1,2], [2,3]]
   * iter([1]).pairwise().toArray() // []
   */
  public pairwise(): ExtendedIterator<[T, T]> {
    return new ExtendedIterator(new PairwiseIterator(this.iterator));
  }

  /**
   * Take the first `n` elements from this iterator.
   * @param n The number of elements to take.
   */
  public take(n: number) {
    return this.slice(0, n);
  }

  /** Iterates and collects all values into an Array. This essentially invokes this iterator to start iterating. */
  public toArray(): T[] {
    const result: T[] = [];
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) result.push(next.value);
    return result;
  }

  /** Shorthand for `new Set(this)`. */
  public toSet() {
    return new Set(this);
  }

  /**
   * Shorthand for `new Map<K, V>(this)`. Must specify the types to get the correct type back,
   * e.g. `iterator.toMap<string, number>();`
   */
  public toMap<K, V>(): Map<K, V>;
  public toMap<KV>(): Map<KV, KV>;
  public toMap<K, V>() {
    return new Map<K, V>(this as any);
  }
}

export default ExtendedIterator;
