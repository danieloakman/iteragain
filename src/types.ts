export type IteratorOrIterable<T> = Iterator<T> | Iterable<T>;

export type FlattenDeep<T> = T extends IteratorOrIterable<infer V>
  ? V extends IteratorOrIterable<infer U>
    ? U
    : V
  : T;

export type FlattenDepth1<T> = T extends IteratorOrIterable<infer V> ? V : T;
