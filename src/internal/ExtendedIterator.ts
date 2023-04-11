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
  IterSource,
  Callback,
  StrictPredicate,
  Awaited,
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
import TapIterator from './TapIterator';
import TriplewiseIterator from './TriplewiseIterator';
import ChunksIterator from './ChunksIterator';
import TakeWhileIterator from './TakeWhileIterator';
import CycleIterator from './CycleIterator';
import ResumeIterator from './ResumeIterator';
import PermutationsIterator from './PermutationsIterator';
import FilterMapIterator from './FilterMapIterator';
import DropWhileIterator from './DropWhileIterator';
import CompressIterator from './CompressIterator';
import ProductIterator from './ProductIterator';
import CombinationsIterator from './CombinationsIterator';
import SeekableIterator from './SeekableIterator';
import TeedIterator from './TeedIterator';
import count from '../count';
import FlatMapIterator from './FlatMapIterator';

/**
 * Extends and implements the IterableIterator interface. Methods marked with the `@lazy` prefix are chainable methods
 * that modify the internal iterator, but don't start iterating. Methods without the `@lazy` prefix do start iterating
 * some amount, depending on the method.
 */
export class ExtendedIterator<T> implements IterableIterator<T> {
  constructor(protected iterator: Iterator<T>) {}

  /** Returns a `{ value, done }` object that adheres to the Iterator interface. */
  next(...args: any[]): IteratorResult<T, T> {
    return this.iterator.next(...args as any);
  }

  /** Implements this as an Iterable so it's allowed to be used with "for of" loops. */
  [Symbol.iterator]() {
    return this;
  }

  toString() {
    return 'ExtendedIterator';
  }

  /** @lazy Returns a new ExtendedIterator that maps each element in this iterator to a new value. */
  map<R>(iteratee: Iteratee<T, R>): ExtendedIterator<R> {
    this.iterator = new MapIterator(this.iterator, iteratee) as any;
    return this as any;
  }

  /**
   * @lazy
   * Returns a new ExtendedIterator that filters each element in this iterator.
   * @param predicate A function that returns a truthy value to indicate to keep that value.
   */
  filter<S extends T>(predicate: StrictPredicate<T, S>): ExtendedIterator<S>;
  filter(predicate: Predicate<T>): ExtendedIterator<T>;
  filter(predicate: Predicate<T>): ExtendedIterator<T> {
    this.iterator = new FilterIterator(this.iterator, predicate);
    return this;
  }

  /**
   * @lazy
   * Maps and filters the input iterator in the same `iteratee` function.
   * @param iteratee A function that maps each value in this iterator to a new value and also filters out any that
   * return a nullish value.
   */
  filterMap<R>(iteratee: Iteratee<T, R>): ExtendedIterator<NonNullable<R>> {
    this.iterator = new FilterMapIterator(this.iterator, iteratee) as any;
    return this as any;
  }

  /** @lazy Concatenates this iterator with the given iterators, in order of: `[this.iterator, ...others]`. */
  concat<U extends IteratorOrIterable<any>[]>(...args: U): ExtendedIterator<T | IterSource<U[number]>> {
    this.iterator = new ConcatIterator([this.iterator, ...(args.map(toIterator) as Iterator<IterSource<U[number]>>[])]);
    return this as any;
  }

  /** @lazy Prepends this iterator with the given iterators, in order of: `[...args, this.iterator]`. */
  prepend<U extends IteratorOrIterable<any>[]>(...args: U): ExtendedIterator<T | IterSource<U[number]>> {
    this.iterator = new ConcatIterator([...(args.map(toIterator) as Iterator<IterSource<U[number]>>[]), this.iterator]);
    return this;
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
  slice(start = 0, end = Infinity): ExtendedIterator<T> {
    this.iterator = new SliceIterator(this.iterator, start, end);
    return this;
  }

  /**
   * @lazy
   * Flatten this iterator by a known depth or deeply.
   * @param depth The number of levels to flatten (default: Infinity, i.e. deeply).
   */
  flatten(depth: 1): ExtendedIterator<FlattenDepth1<T>>;
  flatten(depth: 2): ExtendedIterator<FlattenDepth2<T>>;
  flatten(depth: 3): ExtendedIterator<FlattenDepth3<T>>;
  flatten(depth: 4): ExtendedIterator<FlattenDepth4<T>>;
  flatten(depth: 5): ExtendedIterator<FlattenDepth5<T>>;
  flatten(): ExtendedIterator<FlattenDeep<T>>;
  flatten(depth: number): ExtendedIterator<any>;
  flatten(depth = Infinity): ExtendedIterator<any> {
    this.iterator = new FlattenIterator(this.iterator, depth) as any;
    return this as any;
  }

  /** @lazy Attaches the index to each value as a pair like: `[0, value], [1, value]`, etc. */
  enumerate(): ExtendedIterator<[number, T]> {
    return this.map(((count = 0) => v => [count++, v])()); // prettier-ignore
  }

  /**
   * @lazy
   * The inverse of `zip` and `zipLongest`. This method disaggregates the elements of this iterator. The nth iterator
   * in the returned tuple contains the nth element of each value in this iterator. The length of the returned tuple is
   * determined by the length of the first value in this iterator.
   */
  unzip(): ExtendedIterator<T>[] {
    const [head] = this.peek();
    const n = Array.isArray(head) ? head.length : 1;
    if (n < 2) return [this];
    return this.tee(n).map((it, i) => it.map(v => v[i]));
  }

  /** @lazy Aggregates this iterator and any number of others into one. Stops when one of the iterables is empty. */
  zip<U>(other: IteratorOrIterable<U>): ExtendedIterator<[T, U]>;
  zip<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[T, A, B]>;
  zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
  zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]> {
    this.iterator = new ZipIterator([this.iterator, ...args.map(toIterator)]) as any;
    return this as any;
  }

  /** @lazy Aggregates this iterator and any number of others into one. Stops when all of the iterables is empty. */
  zipLongest<U>(other: IteratorOrIterable<U>): ExtendedIterator<[T, U]>;
  zipLongest<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[T, A, B]>;
  zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
  zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]> {
    this.iterator = new ZipLongestIterator([this.iterator, ...args.map(toIterator)]) as any;
    return this as any;
  }

  /**
   * @lazy
   * Return a new iterator of pairs (tuples) of the values in this one. The number of pairs will always be one fewer
   * than this iterator. Will be empty if this iterator has fewer than two values.
   * @example
   * iter([1,2,3]).pairwise().toArray() // [[1,2], [2,3]]
   * iter([1]).pairwise().toArray() // []
   */
  pairwise(): ExtendedIterator<[T, T]> {
    this.iterator = new PairwiseIterator(this.iterator) as any;
    return this as any;
  }

  /**
   * @lazy
   * Returns a new iterator of triplets (tuples) of the values in this one. The number of triplets will always be two
   * fewer than the number of values in this iterator. Will be empty if this iterator has fewer than three values.
   */
  triplewise(): ExtendedIterator<[T, T, T]> {
    this.iterator = new TriplewiseIterator(this.iterator) as any;
    return this as any;
  }

  /**
   * @lazy
   * Take all elements from this iterator while the given `predicate` returns a truthy value.
   * @param predicate A function to call for each value.
   */
  takeWhile(predicate: Predicate<T>): ExtendedIterator<T> {
    this.iterator = new TakeWhileIterator(this.iterator, predicate);
    return this;
  }

  /**
   * @lazy
   * Drop/skip values in this iterator while the passed `predicate` returns a truthy value.
   * @param predicate The function to call for each value.
   */
  dropWhile(predicate: Predicate<T>): ExtendedIterator<T> {
    this.iterator = new DropWhileIterator(this.iterator, predicate);
    return this;
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
  tap(func: Predicate<T>): ExtendedIterator<T> {
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
  chunks<Length extends number>(length: Length, fill?: T): ExtendedIterator<Tuple<T, Length>> {
    this.iterator = new ChunksIterator(this.iterator, length, fill) as any;
    return this as any;
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
  windows<Length extends number>(length: Length, offset: number, fill?: T): ExtendedIterator<Tuple<T, Length>> {
    this.iterator = new WindowsIterator(this.iterator, length, offset, fill) as any;
    return this as any;
  }

  /**
   * @lazy
   * Returns `n` independent iterators, each of which is a copy of this iterator at the time of calling `tee`. Once
   * `tee` has made a split, do not modify or call upon the original iterator, as the new iterators will not be
   * updated/informed.
   * This caches the original iterator's values as the new iterators are iterated through. So
   * depending on the size of the original iterator, there could be significant memory overhead in using `tee`.
   * `tee`'s intended use is to iterate over the returned iterators in parallel, or at least somewhat in parallel. In
   * general, if one returned iterator consumes most or all of it's values, then it is faster to just
   * use `toArray` and then iterate over that.
   * @param n The number of independent iterators to create.
   */
  tee<N extends number>(n: N): Tuple<ExtendedIterator<T>, N> {
    const seekable = new SeekableIterator(toIterator(this.iterator));
    const indices = new Array(n).fill(0);
    return Array.from({ length: n }, (_, i) => new ExtendedIterator(new TeedIterator(i, seekable, indices))) as Tuple<
      ExtendedIterator<T>,
      N
    >;
  }

  /**
   * @lazy
   * Makes this iterator cycle infinitely through it's values.
   * @param times The number of times to cycle through the iterator (default: Infinity).
   * @example
   * equal(iter([1,2,3]).cycle().take(5).toArray(), [1,2,3,1,2])
   */
  cycle(times = Infinity): ExtendedIterator<T> {
    this.iterator = new CycleIterator(this.iterator, times);
    return this;
  }

  /**
   * @lazy
   * Resumes this iterator a certain number of times after it's next value returns `{ done: true }`.
   * @param times The number of times to resume the iterator (default: Infinity).
   * @example
   * const it = iter([1,2,3]).resume(1);
   * equal(it.toArray(), [1,2,3]);
   * equal(it.toArray(), [1,2,3]);
   * equal(it.toArray(), []);
   */
  resume(times = Infinity): ExtendedIterator<T> {
    this.iterator = new ResumeIterator(this.iterator, times);
    return this;
  }

  /**
   * @lazy
   * Filters/compresses this iterator to only values that correspond to truthy values in `selectors`.
   * @param selectors An iterator or iterable of falsey or truthy values to select which values to keep in this
   * iterator.
   */
  compress(selectors: IteratorOrIterable<any>): ExtendedIterator<T> {
    this.iterator = new CompressIterator(this.iterator, toIterator(selectors));
    return this;
  }

  /**
   * @lazy
   * Returns all successive `size` length permutations of this iterator. The permutations are emitted in lexicographic
   * ordering according to this iterator. So if this iterator is sorted, the permutations will be in sorted order.
   * Elements in the permutations are treated as unique based on their position in the iterator, not on their value. So
   * if the input iterator is unique, then there will be no repeat values.
   * @see https://docs.python.org/3/library/itertools.html#itertools.permutations for more info.
   * @param size The size of each permutation, must be greater than 0 and less than or equal to the length of this
   * iterator.
   */
  permutations<Size extends number>(size?: Size): ExtendedIterator<Tuple<T, Size>> {
    this.iterator = new PermutationsIterator(this.iterator, size) as any;
    return this as any;
  }

  /**
   * @lazy
   * Returns `size` length subsequences of this iterator.
   * @see https://docs.python.org/3/library/itertools.html#itertools.combinations for more info.
   * @see https://docs.python.org/3/library/itertools.html#itertools.combinations_with_replacement for more info.
   * @param size The size of each combination.
   * @param withReplacement Whether or not to allow duplicate elements in the combinations.
   */
  combinations<Size extends number>(size: Size, withReplacement = false): ExtendedIterator<Tuple<T, Size>> {
    this.iterator = new CombinationsIterator(this.iterator, size, withReplacement) as any;
    return this as any;
  }

  /**
   * @lazy
   * Returns the cartesian product of this iterator with other `iterators` after it.
   * @param iterators Other iterators.
   * @param repeat Optional number of times to repeat (default: 1).
   * @see https://docs.python.org/3/library/itertools.html#itertools.product for more info.
   */
  product(repeat?: number): ExtendedIterator<T[]>;
  product(iterators: IteratorOrIterable<T>[], repeat?: number): ExtendedIterator<T[]>;
  product(...params: any[]): ExtendedIterator<T[]> {
    const iterators: Iterator<T>[] = typeof params[0] === 'number' ? [] : params[0];
    const repeat = params.find(param => typeof param === 'number') ?? 1;
    this.iterator = new ProductIterator(
      [this.iterator, ...(iterators.map(toIterator) as Iterator<T>[])],
      repeat,
    ) as any;
    return this as any;
  }

  /**
   * @lazy
   * Filters this iterator to only unique values.
   * @param iteratee Iteratee to use to transform each value before being tested for uniqueness.
   * @param justSeen If true, will only test for uniqueness with the last value in the iterator and not all values.
   */
  unique({ iteratee, justSeen }: { iteratee?: Iteratee<T, any>; justSeen?: boolean } = {}): ExtendedIterator<T> {
    iteratee = iteratee ?? (v => v);
    if (justSeen) {
      let lastValue: T;
      return this.filter(value => {
        value = iteratee(value);
        if (!lastValue || value !== lastValue) {
          lastValue = value;
          return true;
        }
        return false;
      });
    }
    const seen = new Set<T>();
    return this.filter(value => {
      value = iteratee(value);
      if (!seen.has(value)) {
        seen.add(value);
        return true;
      }
      return false;
    });
  }

  /**
   * @lazy
   * Reverses this iterator's order. Note that in order to reverse, it will attempt to iterate fully once, which
   * could cause significant memory usage. So because of this, only use on finite iterators.
   */
  reverse() {
    let next: IteratorResult<T>;
    const result: T[] = [];
    while (!(next = this.iterator.next()).done) result.unshift(next.value);
    this.iterator = toIterator(result);
    return this;
  }

  /** @lazy Maps `key` from `T` in each value of this iterator. */
  pluck(key: keyof T) {
    return this.filterMap(value => value[key]);
  }

  /** Reduces this iterator to a single value. */
  reduce(reducer: (accumulator: T, value: T) => T): T;
  reduce<R>(reducer: (accumulator: R, value: T) => R, initialValue: R): R;
  reduce<R>(reducer: (accumulator: T | R, value: T) => R): R;
  reduce<R>(reducer: (accumulator: R | T, value: T) => R, initialValue?: R): R {
    let next: IteratorResult<T>;
    let accumulator = initialValue ?? this.iterator.next().value;
    while (!(next = this.iterator.next()).done) accumulator = reducer(accumulator, next.value);
    return accumulator;
  }

  /** Consumes this iterator and returns the number of values/items in it. */
  length() {
    return this.reduce((acc, _) => acc + 1, 0);
  }

  /** Returns the number of times the `predicate` returns a truthy value. */
  quantify(predicate: Predicate<T>): number {
    return this.reduce((acc, v) => acc + (predicate(v) ? 1 : 0), 0);
  }

  /** Returns the minimum value from this iterator. */
  min(iteratee: Iteratee<T, number> = v => v as unknown as number): T {
    let next = this.iterator.next();
    let min = { value: next.value, comparison: iteratee(next.value) };
    while (!(next = this.iterator.next()).done) {
      const comparison = iteratee(next.value);
      if (comparison < min.comparison) min = { value: next.value, comparison };
    }
    return min.value;
  }

  /** Returns the maximum value from this iterator. */
  max(iteratee: Iteratee<T, number> = v => v as unknown as number): T {
    let next = this.iterator.next();
    let max = { value: next.value, comparison: iteratee(next.value) };
    while (!(next = this.iterator.next()).done) {
      const comparison = iteratee(next.value);
      if (comparison > max.comparison) max = { value: next.value, comparison };
    }
    return max.value;
  }

  /** Returns the minimum and maximum from this iterator as a tuple: `[min, max]`. */
  minmax(iteratee: Iteratee<T, number> = v => v as unknown as number): [T, T] {
    let next = this.iterator.next();
    let min = { value: next.value, comparison: iteratee(next.value) };
    let max = { value: next.value, comparison: iteratee(next.value) };
    while (!(next = this.iterator.next()).done) {
      const comparison = iteratee(next.value);
      if (comparison < min.comparison) min = { value: next.value, comparison };
      if (comparison > max.comparison) max = { value: next.value, comparison };
    }
    return [min.value, max.value];
  }

  /** Iterate over this iterator using the `array.prototype.forEach` style of method. */
  forEach(callback: Callback<T>) {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) callback(next.value);
  }

  /** Return true if every element in this iterator matches the predicate. */
  every(predicate: Predicate<T>): boolean {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (!predicate(next.value)) return false;
    return true;
  }

  /** Return true if only one element in this iterator matches the predicate. */
  some(predicate: Predicate<T>): boolean {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (predicate(next.value)) return true;
    return false;
  }

  /**
   * Returns this iterator as a string with each value joined by `separator`.
   * @param separator The separator to use between each value (default: ',').
   */
  join(separator = ','): string {
    return this.reduce((str, v) => str + separator + v);
  }

  /**
   * Finds the first value that passes a truthy value to `predicate`, then returns it. Only consumes the iterator's
   * values up to the found value, then stops. So if it's not found, then the iterator is exhausted.
   */
  find<V extends T>(predicate: (value: T) => value is V): V | undefined;
  find(predicate: Predicate<T>): T | undefined;
  find(predicate: Predicate<T>): T | undefined {
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) if (predicate(next.value)) return next.value;
  }

  /**
   * Finds the index of the first value that passes a truthy vale to `predicate`, then returns it. Only consumes the
   * iterator's values up to the found value, then stops. So if it's not found, then the iterator is exhausted.
   */
  findIndex(predicate: Predicate<T>): number {
    let next: IteratorResult<T>;
    let i = -1;
    while ((i++, !(next = this.iterator.next()).done)) if (predicate(next.value)) return i;
    return -1;
  }

  /**
   * Maps this iterator to a new value `R` and flattens any resulting iterables or iterators by a depth of 1.
   * Behaves the same as `Array.prototype.flatMap`.
   */
  flatMap<R>(iteratee: Iteratee<T, R | IteratorOrIterable<R>>): ExtendedIterator<R> {
    this.iterator = new FlatMapIterator(this.iterator, iteratee) as any;
    return this as any;
  }

  /** Returns true if `value` strictly equals some value in this iterator. */
  includes(value: T): boolean {
    return this.some(v => v === value);
  }

  /**
   * Peek ahead of where the current iteration is. This doesn't consume any values of the iterator.
   * @param ahead optional, the number of elements to peek ahead.
   */
  peek<N extends number = 1>(ahead: N = 1 as N): Tuple<T, N> {
    const values = this.take(ahead);
    if (values.length) this.iterator = new ConcatIterator([toIterator(values), this.iterator]);
    return values;
  }

  /**
   * Take `n` number of values from this iterator.
   * @param n The number of values to take.
   */
  take<N extends number = 1>(n: N = 1 as N): Tuple<T, N> {
    const values: T[] = [];
    let next: IteratorResult<T>;
    while (n-- > 0 && !(next = this.iterator.next()).done) values.push(next.value);
    return values as Tuple<T, N>;
  }

  /**
   * @deprecated Use `consume` instead, as this is the more standard name for this type of method.
   * Start iterating through this iterator, but don't return the values from this method.
   * @param n optional, the number of elements to exhaust.
   */
  exhaust(n = Infinity): void {
    this.consume(n);
  }

  /**
   * Start iterating through this iterator, but don't return the values from this method.
   * @param n optional, the number of elements to consume (default: Infinity).
   */
  consume(n = Infinity): void {
    while (n-- > 0 && !this.iterator.next().done);
  }

  /** Collects all values from this iterator, then shuffles the order of it's values. */
  shuffle(): ExtendedIterator<T> {
    const values = this.toArray();
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    this.iterator = toIterator(values);
    return this;
  }

  /** Collects all values from this iterator, then sorts them. */
  sort(comparator: (a: T, b: T) => number = (a, b) => a < b ? -1 : a > b ? 1 : 0): ExtendedIterator<T> {
    this.iterator = toIterator(this.toArray().sort(comparator));
    return this;
  }

  /**
   * Partitions this iterator into a tuple of `[falsey, truthy]` corresponding to what `predicate` returns for each
   * value.
   */
  partition(predicate: Predicate<T>): [T[], T[]] {
    const falsey: T[] = [];
    const truthy: T[] = [];
    this.tap(value => (predicate(value) ? truthy : falsey).push(value)).consume();
    return [falsey, truthy];
  }

  /**
   * @lazy
   * Distributes this iterator's values among `n` amount of smaller iterators. Does not maintain order so if order is
   * important, use `divide` instead.
   */
  distribute<Size extends number>(n: Size): Tuple<ExtendedIterator<T>, Size> {
    return this.tee(n).map((it, i) => it.compress(new ExtendedIterator(count()).map(v => (v - i) % n === 0))) as Tuple<
      ExtendedIterator<T>,
      Size
    >;
  }

  /**
   * Divides this iterator into `n` amount of smaller iterators while maintaining order. Note, this method will fully
   * iterate through this iterator before returning a result. If you don't want this behavior and don't care about
   * order then use `distribute` instead.
   */
  divide<Size extends number>(n: Size): Tuple<ExtendedIterator<T>, Size> {
    const array = this.toArray();
    const result: ExtendedIterator<T>[] = [];
    const quotient = Math.floor(array.length / n);
    const remainder = array.length % n;
    let stop = 0;
    let start = 0;
    for (let i = 1; i < n + 1; i++) {
      start = stop;
      stop += i <= remainder ? quotient + 1 : quotient;
      result.push(new ExtendedIterator(toIterator(array.slice(start, stop))));
    }
    return result as Tuple<ExtendedIterator<T>, Size>;
  }

  /**
   * Iterates and finds the element at `index`. Returns undefined if not found.
   * @param index The index to find. Only supports positive indices.
   */
  nth(index: number): T | undefined {
    let i = 0;
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done && index !== i++);
    return next.value;
  }

  /** Iterates and collects all values into an Array. */
  toArray(): T[] {
    const result: T[] = [];
    let next: IteratorResult<T>;
    while (!(next = this.iterator.next()).done) result.push(next.value);
    return result;
  }

  /** Calls `Promise.all` on all collected values. */
  promiseAll(): Promise<Awaited<T>[]> {
    return Promise.all(this.toArray()) as Promise<Awaited<T>[]>;
  }

  /** Calls `Promise.race` on all collected values. */
  promiseRace(): Promise<Awaited<T>> {
    return Promise.race(this.toArray()) as Promise<Awaited<T>>;
  }

  /** Shorthand for `new Set(this)`. */
  toSet() {
    return new Set(this);
  }

  /**
   * Shorthand for `new Map<K, V>(this)`. The type of this iterator must extend `any[]` for this to work. And you may
   * also need to pass in your own values for the generics: e.g. `iterator.toMap<string, number>();`
   */
  toMap<K extends string | number = T extends any[] ? T[0] : never, V = T extends any[] ? T[1] : never>() {
    return new Map<K, V>(this as any);
  }
}

export default ExtendedIterator;
