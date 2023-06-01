import seekable from './seekable';
import { IteratorOrIterable } from './types';

/**
 * Creates a proxy object that allows for readonly array-like access to the elements of the input iterator. Some
 * important things to note are:
 * - `length` will always be the length of the internal cache, not the length of the final
 * iterated values.
 * - `Symbol.iterator` will always iterate over the entire input iterator, not just the cached values.
 * - Negative indices are allowed, and will seek backwards from the end of the internal cache.
 * @param arg The input iterator or iterable.
 */
export function arrayLike<T>(arg: IteratorOrIterable<T>): readonly T[] {
  const it = seekable(arg);
  // eslint-disable-next-line no-undef
  return new Proxy([], {
    get(target, prop) {
      if (prop === 'length') return it.elements.length;
      else if (prop === Symbol.iterator) {
        it.seek(0);
        return it[Symbol.iterator].bind(it);
      } else if (typeof prop === 'string' && /^-?\d+$/.test(prop)) {
        const index = Number(prop);
        if (isNaN(index)) return undefined;
        // Circumvent seeking if the index is within the cached elements:
        if (index in it.elements) return it.elements[index];
        it.seek(index);
        return it.next().value;
      } else if (prop && prop in target) {
        const value: unknown = target[prop as any];
        if (typeof value === 'function') return value.bind(it.elements);
        return value;
      }
      return undefined;
    },
    has: (_, prop) => {
      return prop in it.elements;
    },
    ownKeys: () => {
      return Object.keys(it.elements);
    },
    getOwnPropertyDescriptor: (_, prop) => {
      return Object.getOwnPropertyDescriptor(it.elements, prop);
    },
    set: (_, prop) => {
      throw new TypeError(`Cannot assign to read only property '${prop.toString()}' of ArrayLikeIterator.`);
    },
    deleteProperty: (_, prop) => {
      throw new TypeError(`Cannot delete property '${prop.toString()}' of ArrayLikeIterator.`);
    },
    defineProperty: (_, prop) => {
      throw new TypeError(`Cannot define property '${prop.toString()}' of ArrayLikeIterator.`);
    },
  });
}
