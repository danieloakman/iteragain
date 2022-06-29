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
