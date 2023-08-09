export type IteratorOrIterable<T> = Iterator<T> | Iterable<T>;

// export type AsyncIteratorOrIterable<T> = AsyncIterator<T> | AsyncIterable<T>;

export type FlattenDeep<T> = T extends IteratorOrIterable<infer V>
  ? V extends IteratorOrIterable<infer U>
    ? U
    : V
  : T;

// export type AsyncFlattenDeep<T> = T extends AsyncIteratorOrIterable<infer V>
//   ? V extends AsyncIteratorOrIterable<infer U>
//     ? U
//     : V
//   : T;

export type FlattenDepth1<T> = T extends IteratorOrIterable<infer V> ? V : T;
export type FlattenDepth2<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth1<V> : T;
export type FlattenDepth3<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth2<V> : T;
export type FlattenDepth4<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth3<V> : T;
export type FlattenDepth5<T> = T extends IteratorOrIterable<infer V> ? FlattenDepth4<V> : T;

// export type AsyncFlattenDepth1<T> = T extends AsyncIteratorOrIterable<infer V> ? V : T;
// export type AsyncFlattenDepth2<T> = T extends AsyncIteratorOrIterable<infer V> ? AsyncFlattenDepth1<V> : T;
// export type AsyncFlattenDepth3<T> = T extends AsyncIteratorOrIterable<infer V> ? AsyncFlattenDepth2<V> : T;
// export type AsyncFlattenDepth4<T> = T extends AsyncIteratorOrIterable<infer V> ? AsyncFlattenDepth3<V> : T;
// export type AsyncFlattenDepth5<T> = T extends AsyncIteratorOrIterable<infer V> ? AsyncFlattenDepth4<V> : T;

type TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : TupleOf<T, N, [T, ...R]>;
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

/** Creates a union of all integers between `StartInclusive` and `EndExclusive`. */
export type IntRange<StartInclusive extends number, EndExclusive extends number> = Exclude<
  Enumerate<EndExclusive>,
  Enumerate<StartInclusive>
>;

/**
 * Creates a tuple of `T` and size `N` which is unconstrained by size of `N`. So for large tuples the
 * "Type instantiation is excessively deep and possibly infinite" TS error will occur.
 */
export type UnconstrainedTuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : TupleOf<T, N, []>
  : never;

export type Tuple<T, N extends number, Range extends number = IntRange<0, 11>> = N extends Range
  ? UnconstrainedTuple<T, N>
  : T[];

// type a = Tuple<number, 0>;
// //   ^?
// type b = Tuple<number, 10>;
// //   ^?
// type c = Tuple<number, 11>;
// //   ^?

/** A function that returns a truthy or falsey value given an input value of type `T`. */
export type Predicate<T> = (value: T) => unknown;

/** A function that returns a truthy or falsey value that determines if `T` is `S`. */
export type StrictPredicate<T, S extends T> = (value: T) => value is S;

// /** An async function that returns a truthy or falsey value given an input value of type `T`. */
// export type AsyncPredicate<T> = (value: T) => Promise<any>;

/** A function designated as a callback which doesn't necessarily return anything. */
export type Callback<T, R = unknown> = (value: T) => R;

// /** An async function designated as a callback which doesn't necessarily return anything. */
// export type AsyncCallback<T, R = any> = (value: T) => Promise<R>;

/** A function that does something with value of type `T` and transforms it into type `R`. */
export type Iteratee<T, R> = (value: T) => R;

// /** An async function that does something with value of type `T` and transforms it into type `R`. */
// export type AsyncIteratee<T, R> = (value: T) => Promise<R>;

/** Any generic function. */
export interface AnyFunction {
  (...args: any[]): any;
}

/** Returns the source of the generic Iterable, Iterator, IterableIterator or their async counterparts. */
export type IterSource<T> = T extends Iterable<infer U>
  ? U
  : T extends Iterator<infer U>
  ? U
  : T extends IterableIterator<infer U>
  ? U
  : T extends AsyncIterable<infer U>
  ? U
  : T extends AsyncIterator<infer U>
  ? U
  : T extends AsyncIterableIterator<infer U>
  ? U
  : T;

export type MapToSource<T extends IteratorOrIterable<any>[]> = {
  [K in keyof T]: IterSource<T[K]>;
};

// export type ObjectLeafs<T extends Record<string, unknown>, K = keyof T> = K extends string
//   ? T[K] extends Record<string, unknown>
//     ? ObjectLeafs<T[K], keyof T[K]>
//     : [K, T[K]]
//   : T;

// export type ObjectBranches<T extends Record<string, unknown>, K = keyof T> = K extends string
//   ? T[K] extends Record<string, unknown>
//     ? [K, T[K]] | ObjectBranches<T[K], keyof T[K]>
//     : never
//   : T;

// export type ObjectEntries<T extends Record<string, unknown>> = ObjectLeafs<T> | ObjectBranches<T>;

/** A tuple representing the key, value and parent object (in that order) of an entry/key-value pair in an object. */
export type ObjectEntry<T = any> = [string, T, any];

/** Recursively unwraps `T` until it's not a Promise, (Polyfill) */
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type KeyIdentifier<T> = keyof T | Iteratee<T, any>;

export type KeyIdentifiersValue<T, K extends KeyIdentifier<T>> = K extends keyof T
  ? T[K]
  : K extends Iteratee<T, any>
  ? ReturnType<K>
  : never;

/** The params used for `unique` method/function. */
export type UniqueParams<T> = { iteratee?: Iteratee<T, any>; justSeen?: boolean } | Iteratee<T, any>;

export type ShiftArr<T extends unknown[]> = T extends [unknown, ...infer P] ? P : never;

export interface Curry1<T extends AnyFunction> {
  (...args: Parameters<T>): ReturnType<T>;
  (...args: ShiftArr<Parameters<T>>): (arg0: Parameters<T>[0]) => ReturnType<T>;
  // (...args: ParametersExceptFirst<ParametersExceptFirst<T>>): (
  //   arg0: Parameters<T>[0],
  // ) => (arg1: Parameters<T>[1]) => ReturnType<T>;
  // (...args: ParametersExceptFirst<ParametersExceptFirst<ParametersExceptFirst<T>>>): (
  //   arg0: Parameters<T>[0],
  // ) => (arg1: Parameters<T>[1]) => (arg2: Parameters<T>[2]) => ReturnType<T>;
  // (...args: ParametersExceptFirst<ParametersExceptFirst<ParametersExceptFirst<ParametersExceptFirst<T>>>>): (
  //   arg0: Parameters<T>[0],
  // ) => (arg1: Parameters<T>[1]) => (arg2: Parameters<T>[2]) => (arg3: Parameters<T>[3]) => ReturnType<T>;
}

