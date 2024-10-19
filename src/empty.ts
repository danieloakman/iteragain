import EmptyIterator from './internal/EmptyIterator';

/** An iterator that yields nothing. As in, it's first call to `next()` returns `{ done: true, value: undefined }`. */
export function empty<T = never>(): IterableIterator<T> {
  return new EmptyIterator();
}

export default empty;
