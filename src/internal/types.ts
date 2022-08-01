export type IteratorOrIterable<T> = Iterator<T> | Iterable<T>;

export type FlattenDeep<T> = T extends IteratorOrIterable<infer V>
  ? V extends IteratorOrIterable<infer U>
    ? U
    : V
  : T;

// TODO, Find a better way to create these types:
export type FlattenDepth1<T> = T extends IteratorOrIterable<infer V> ? V : T;
export type FlattenDepth2<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth1<V> : T;
export type FlattenDepth3<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth2<V> : T;
export type FlattenDepth4<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth3<V> : T;
export type FlattenDepth5<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth4<V> : T;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;

/** A function that returns a truthy value given an input value of type `T`. */
export type Predicate<T> = (value: T) => any;

/** A function that does something with value of type `T` and transforms it into type `R`. */
export type Iteratee<T, R> = (value: T) => R;

/** Returns the source of the generic Iterable, Iterator or IterableIterator */
export type IterSource<T> = T extends Iterable<infer U>
  ? U
  : T extends Iterator<infer U>
  ? U
  : T extends IterableIterator<infer U>
  ? U
  : T;
