import {
  IteratorOrIterable,
  FlattenDeep,
  FlattenDepth1,
  FlattenDepth2,
  FlattenDepth3,
  FlattenDepth4,
  FlattenDepth5,
  Tuple,
  Predicate,
  Iteratee,
} from './types';
import toIterator from '../toIterator';
import ConcatIterator from './ConcatIterator';
import FilterIterator from './FilterIterator';
import FlattenIterator from './FlattenIterator';
import MapIterator from './MapIterator';
import WindowsIterator from './WindowsIterator';
import PairwiseIterator from './PairwiseIterator';
import SliceIterator from './SliceIterator';
import ZipIterator from './ZipIterator';
import ZipLongestIterator from './ZipLongestIterator';
import SkipWhileIterator from './SkipWhileIterator';
import TapIterator from './TapIterator';
import TriplewiseIterator from './TripleWiseIterator';
import ChunksIterator from './ChunksIterator';
import CachedIterator from './CachedIterator';
import TakeWhileIterator from './TakeWhileIterator';
import CycleIterator from './CycleIterator';
import ContinueIterator from './ContinueIterator';
import PermutationsIterator from './PermutationsIterator';
import FilterMapIterator from './FilterMapIterator';
import DropWhileIterator from './DropWhileIterator';

/**
 * Extends and implements the IterableIterator interface. Methods marked with the `@lazy` prefix are chainable methods
 * that modify the internal iterator, but don't start iterating. Methods without the `@lazy` prefix do start iterating
 * some amount, depending on the method.
 */
export class ExtendedIterator<T> implements IterableIterator<T> {
  public constructor(protected iterator: Iterator<T>) {}

  /** Returns a `{ value, done }` object that adheres to the Iterator interface. */
  public next(): IteratorResult<T> {
    return this.iterator.next();
  }

  /** Implements this as an Iterable so it's allowed to be used with "for of" loops. */
  public [Symbol.iterator]() {
    return this;
  }

  public toString() {
    return 'ExtendedIterator';
  }

  /** @lazy Returns a new ExtendedIterator that maps each element in this iterator to a new value. */
  public map<R>(iteratee: Iteratee<T, R>): ExtendedIterator<R> {
    return new ExtendedIterator(new MapIterator(this.iterator, iteratee));
  }

  /**
   * @lazy
   * Returns a new ExtendedIterator that filters each element in this iterator.
   * @param predicate A function that returns a truthy value to indicate to keep that value.
   */
  public filter(predicate: Predicate<T>): ExtendedIterator<T> {
    this.iterator = new FilterIterator(this.iterator, predicate);
    return this;
  }

  /**
   * @lazy
   * @param iteratee A function that maps each value in this iterator to a new value and also filters out any that
   * return a nullish value.
   */
  public filterMap<R>(iteratee: (value: T) => R): ExtendedIterator<NonNullable<R>> {
    return new ExtendedIterator(new FilterMapIterator(this.iterator, iteratee));
  }

  /** @lazy Concatenates this iterator with the given iterators, in order of: `[this.iterator, ...others]`. */
  public concat<A>(other: IteratorOrIterable<A>): ExtendedIterator<T | A>;
  public concat<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<T | A | B>;
  public concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any>;
  public concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any> {
    return new ExtendedIterator(new ConcatIterator([this.iterator, ...args.map(toIterator)]));
  }

  /** @lazy Prepends this iterator with the given iterators, in order of: `[...args, this.iterator]`. */
  public prepend<A>(other: IteratorOrIterable<A>): ExtendedIterator<A | T>;
  public prepend<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<A | B | T>;
  public prepend(...args: IteratorOrIterable<any>[]): ExtendedIterator<any>;
  public prepend(...args: IteratorOrIterable<any>[]): ExtendedIterator<any> {
    return new ExtendedIterator(new ConcatIterator([...args.map(toIterator), this.iterator]));
  }

  /**
   * @lazy
   * Works like `Array.prototype.slice`, returns a new slice of this iterator.
   * @note This does not support negative `start` and `end` indices, as it's not possible to know the length of the
   * iterator while iterating.
   * @param start The index to start at (inclusive).
   * @param end The index to end at (exclusive).
   * @returns A new ExtendedIterator that only includes the elements between `start` and `end`.
   */
  public slice(start = 0, end = Infinity): ExtendedIterator<T> {
    this.iterator = new SliceIterator(this.iterator, start, end);
    return this;
  }

  /**
   * @lazy
   * Flatten this iterator by a known depth or deeply.
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
    return new ExtendedIterator(new FlattenIterator(this, depth));
  }

  /** @lazy Attaches the index to each value as a pair like: `[0, value], [1, value]`, etc. */
  public enumerate(): ExtendedIterator<[number, T]> {
    return this.map(((count = 0) => v => [count++, v])()); // prettier-ignore
  }

  /** @lazy Aggregates this iterator and any number of others into one. Stops when one of the iterables is empty. */
  public zip<U>(other: IteratorOrIterable<U>): ExtendedIterator<[T, U]>;
  public zip<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[T, A, B]>;
  public zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
  public zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]> {
    return new ExtendedIterator(new ZipIterator([this.iterator, ...args.map(toIterator)]));
  }

  /** @lazy Aggregates this iterator and any number of others into one. Stops when all of the iterables is empty. */
  public zipLongest<U>(other: IteratorOrIterable<U>): ExtendedIterator<[T, U]>;
  public zipLongest<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[T, A, B]>;
  public zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
  public zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]> {
    return new ExtendedIterator(new ZipLongestIterator([this.iterator, ...args.map(toIterator)]));
  }

  /**
   * @lazy
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
   * @lazy
   * Returns a new iterator of triplets (tuples) of the values in this one. The number of triplets will always be two
   * fewer than the number of values in this iterator. Will be empty if this iterator has fewer than three values.
   */
  public triplewise(): ExtendedIterator<[T, T, T]> {
    return new ExtendedIterator(new TriplewiseIterator(this.iterator));
  }

  /**
   * @lazy
   * Take the first `n` elements from this iterator. Equivalent to `iterator.slice(0, n)`.
   * @param n The number of elements to take.
   */
  public take(n: number): ExtendedIterator<T> {
    return this.slice(0, n);
  }

  /**
   * @lazy
   * Take all elements from this iterator while the given `predicate` returns a truthy value.
   * @param predicate A function to call for each value.
   */
  public takeWhile(predicate: Predicate<T>): ExtendedIterator<T> {
    return new ExtendedIterator(new TakeWhileIterator(this.iterator, predicate));
  }

  /**
   * @deprecated Use `drop` instead as this is the more used name for this method among the use of iterators.
   * @lazy
   * Skip the first `n` elements from this iterator. Equivalent to `iterator.slice(n)`.
   * @param n The number of elements to skip.
   */
  public skip(n: number): ExtendedIterator<T> {
    return this.slice(n);
  }

  /**
   * @deprecated Use `dropWhile` instead as this is the more used name for this method among the use of iterators.
   * @lazy
   * Skip values in this iterator while the passed `predicate` returns a truthy value.
   * @param predicate The function to call for each value.
   */
  public skipWhile(predicate: Predicate<T>): ExtendedIterator<T> {
    return new ExtendedIterator(new SkipWhileIterator(this.iterator, predicate));
  }

  /**
   * @lazy
   * Drop/skip the first `n` elements from this iterator. Equivalent to `iterator.slice(n)`.
   * @param n The number of elements to drop.
   */
  public drop(n: number): ExtendedIterator<T> {
    return this.slice(n);
  }

  /**
   * @lazy
   * Drop/skip values in this iterator while the passed `predicate` returns a truthy value.
   * @param predicate The function to call for each value.
   */
  public dropWhile(predicate: Predicate<T>): ExtendedIterator<T> {
    return new ExtendedIterator(new DropWhileIterator(this.iterator, predicate));
  }

  /**
   * @lazy
   * Tap into this iterator by supplying `func` which is passed each value of this iterator. The return value of
   * func is unused and this method is purely designed for a designated place to perform side effects.
   * @example
   *  iter([1,2,3])
   *    .tap(console.log) // logs 1, 2, 3 to the console
   *    .map(n => n * n)
   *    .tap(console.log) // logs 1, 4, 9 to the console
   *    .toArray() // returns [1, 4, 9]
   */
  public tap(func: Predicate<T>): ExtendedIterator<T> {
    this.iterator = new TapIterator(this.iterator, func);
    return this;
  }

  /**
   * @lazy
   * Yields non-overlapping chunks (tuples) of `length` from this iterator.
   * @param length The length of each chunk, must be greater than 0.
   * @param fill Optional, the value to fill the last chunk with if it's not the same length as the rest of the iterator.
   * @example
   * iter([1,2,3,4,5,6,7,8,9]).chunk(3).toArray() // [[1,2,3], [4,5,6], [7,8,9]]
   * iter([1,2,3,4,5,6,7,8,9]).chunk(2, 0).toArray() // [[1,2], [3,4], [5,6], [7,8], [9, 0]]
   */
  public chunks<N extends number>(length: N, fill?: T): ExtendedIterator<Tuple<T, N>[]> {
    return new ExtendedIterator(new ChunksIterator(this.iterator, length, fill)) as ExtendedIterator<Tuple<T, N>[]>;
  }

  /**
   * @lazy
   * Yields sliding windows (tuples) of `length` from this iterator. Each window is separated by `offset` number of
   * elements.
   * @param length The length of each window, must be greater than 0.
   * @param offset The offset of each window from each other. Must be greater than 0.
   * @param fill Optional, the value to fill the last window with if it's not the same length as the rest of the iterator.
   * @example
   * iter([1,2,3,4,5]).windows(2, 1).toArray() // [[1,2], [2,3], [3,4], [4,5]]
   * iter([1,2,3,4,5]).windows(2, 3).toArray() // [[1,2], [4,5]]
   * iter([1,2,3,4,5]).windows(3, 3, 0).toArray() // [[1,2,3], [4,5,0]]
   */
  public windows<Length extends number>(length: Length, offset: number, fill?: T): ExtendedIterator<Tuple<T, Length>> {
    return new ExtendedIterator(new WindowsIterator(this.iterator, length, offset, fill)) as ExtendedIterator<
      Tuple<T, Length>
    >;
  }

  /**
   * @lazy
   * Returns `n` independent iterators, each of which is a copy of this iterator at the time of calling `tee`. Once
   * `tee` has made a split, do not modify or call upon the original iterator, as the new iterators will not be
   * updated/informed.
   * This caches the original iterator's values as the new iterators are iterated through. So
   * depending on the size of the orignal iterator, there could be signaficant memory overhead in using `tee`.
   * `tee`'s intended use is to iterate over the returned iterators in parallel, or at least somewhat in parallel. In
   * general, if one returned iterator consumes most or all of it's values, then it is faster to just
   * use `toArray` and then iterate over that.
   * @param n The number of independent iterators to create.
   */
  public tee<N extends number>(n: N): Tuple<ExtendedIterator<T>, N> {
    const cachedIterator = new CachedIterator(this.iterator);
    const indices = new Array(n).fill(0);
    // let currentLow = 0;
    return Array.from(
      { length: n },
      (_, i) =>
        new ExtendedIterator({
          next(): IteratorResult<T> {
            while (!cachedIterator.cache.has(indices[i]) && !cachedIterator.next().done);
            const value = cachedIterator.cache.get(indices[i]);
            if (value === undefined) return { done: true, value: undefined };
            // const low = Math.min(...indices) - 1;
            // if (low > currentLow) {
            //   currentLow = low;
            //   for (let i = currentLow; i > -1; i--) {
            //     if (!cachedIterator.cache.has(i)) break;
            //     cachedIterator.cache.delete(i);
            //   }
            // }
            indices[i]++;
            return { done: false, value };
          },
        }),
    ) as Tuple<ExtendedIterator<T>, N>;
  }

  /**
   * @lazy
   * Makes this iterator cycle infinitely through it's values.
   * @param times The number of times to cycle through the iterator (default: Infinity).
   * @example
   * equal(iter([1,2,3]).cycle().take(5).toArray(), [1,2,3,1,2])
   */
  public cycle(times = Infinity): ExtendedIterator<T> {
    return new ExtendedIterator(new CycleIterator(this.iterator, times));
  }

  /**
   * @lazy
   * Continues this iterator a certain number of times after it's next value returns `{ done: true }`.
   * @param times The number of times to continue the iterator.
   * @example
   * const it = iter([1,2,3]).continue(1);
   * equal(it.toArray(), [1,2]);
   * equal(it.toArray(), [1,2]);
   * equal(it.toArray(), []);
   */
  public continue(times = Infinity): ExtendedIterator<T> {
    return new ExtendedIterator(new ContinueIterator(this.iterator, times));
  }

  /**
   * @lazy
   * Returns all successive `size` length permutations of this iterator. The permutations are emitted in lexicographic
   * ordering according to this iterator. So if this iterator is sorted, the permutations will be in sorted order.
   * Elements in the permutations are treated as unique based on their position in the iterator, not on their value. So
   * if the input iterator is unique, then there will be no repeat values.
   * @see https://docs.python.org/3/library/itertools.html#itertools.permutations for more info, as it does the same
   * thing.
   * @param size The size of each permutation, must be greater than 0 and less than or equal to the length of this
   * iterator.
   */
  public permutations<Size extends number>(size?: Size): ExtendedIterator<Tuple<T, Size>> {
    return new ExtendedIterator(new PermutationsIterator(this.iterator, size));
  }

  /** Reduces this iterator to a single value. */
  public reduce(reducer: (accumulator: T, value: T) => T): T;
  public reduce<R>(reducer: (accumulator: R, value: T) => R, initialValue: R): R;
  public reduce<R>(reducer: (accumulator: T | R, value: T) => R): R;
  public reduce<R>(reducer: (accumulator: R | T, value: T) => R, initialValue?: R): R {
    let accumulator = initialValue ?? this.iterator.next().value;
    for (const value of this) accumulator = reducer(accumulator, value);
    return accumulator;
  }

  /** Returns the number of times the `predicate` returns a truthy value. */
  public quantify(predicate: Predicate<T>): number {
    return this.reduce((acc, v) => acc + (predicate(v) ? 1 : 0), 0);
  }

  /** Iterate over this iterator using the `array.prototype.forEach` style of method. */
  public forEach(callback: Predicate<T>) {
    for (const value of this) callback(value);
  }

  /** Return true if every element in this iterator matches the predicate. */
  public every(predicate: Predicate<T>): boolean {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (!predicate(next.value)) return false;
    return true;
  }

  /** Return true if only one element in this iterator matches the predicate. */
  public some(predicate: Predicate<T>): boolean {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (predicate(next.value)) return true;
    return false;
  }

  /** Returns this iterator as a string with each value joined by `separator`. */
  public join(separator = ','): string {
    return this.reduce((str, v) => str + separator + v);
  }

  /**
   * Finds the first value that passes a truthy value to `predicate`, then returns it. Only consumes the iterator's
   * values up to the found value, then stops. So if it's not found, then the iterator is exhausted.
   */
  public find<V extends T>(predicate: (value: T) => value is V): V | undefined;
  public find(predicate: Predicate<T>): T | undefined;
  public find(predicate: Predicate<T>): T | undefined {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (predicate(next.value)) return next.value;
  }

  /** Returns true if `value` strictly equals some value in this iterator. */
  public includes(value: T): boolean {
    return this.some(v => v === value);
  }

  /**
   * Peek ahead of where the current iteration is. This doesn't consume any values of the iterator.
   * @param ahead optional, the number of elements to peek ahead.
   */
  public peek(): T | undefined;
  public peek<N extends number>(ahead: N): Tuple<T, N>;
  public peek(ahead?: number): T | T[] | undefined {
    const values = this.yield(ahead);
    const valuesAsArray = Array.isArray(values) ? values : [values];
    if (values && valuesAsArray.length) this.iterator = new ConcatIterator([toIterator(valuesAsArray), this.iterator]);
    return values;
  }

  /**
   * Yield `n` number of values from this iterator.
   * @param n The number of values to yield.
   */
  public yield(): T | undefined;
  public yield<N extends number>(numOfValues: N): Tuple<T, N>;
  public yield(n?: number): T | T[] | undefined {
    if (!n) return this.iterator.next().value;
    const values: T[] = [];
    let next: IteratorResult<T>;
    while (n-- > 0 && !(next = this.iterator.next()).done) values.push(next.value);
    return values;
  }

  /**
   * Start iterating through this iterator, but don't return the values from this method.
   * @param n optional, the number of elements to exhaust.
   */
  public exhaust(n?: number): void {
    if (typeof n !== 'number') while (!this.iterator.next().done);
    else while (n-- > 0 && !this.iterator.next().done);
  }

  /**
   * Partitions this iterator into a tuple of `[falsey, truthy]` corresponding to what `predicate` returns for each
   * value.
   */
  public partition(predicate: Predicate<T>): [T[], T[]] {
    const falsey: T[] = [];
    const truthy: T[] = [];
    this.tap(value => (predicate(value) ? truthy : falsey).push(value)).exhaust();
    return [falsey, truthy];
  }

  /**
   * Iterates and finds the element at `index`. Returns undefined if not found.
   * @param index The index to find. Only supports positive indices.
   */
  public nth(index: number): T | undefined {
    let i = 0;
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done && index !== i++);
    return next.value;
  }

  /** Iterates and collects all values into an Array. */
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
