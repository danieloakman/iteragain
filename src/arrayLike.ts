import seekable from './seekable';
import type { IteratorOrIterable } from './types';

// TODO: possible add an overload for passing in a seekable to begin with, so that the maxLength param could be used.
/**
 * @description Creates a proxy object that allows for readonly array-like access to the elements of the input iterator. Some
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
    get(target, prop): unknown {
      if (prop === 'length') return it.elements.length;
      else if (prop === Symbol.iterator) {
        it.seek(0);
        return it[Symbol.iterator].bind(it);
      } else if (prop && prop in it.elements) {
        const value: unknown = target[prop as any];
        if (typeof value === 'function') return value.bind(it.elements);
      }
      const index = Number(prop);
      if (!isNaN(index)) {
        it.seek(index);
        return it.next().value;
      }
      return undefined;
    },
    has(_, prop): boolean {
      return prop in it.elements;
    },
    ownKeys(): string[] {
      return Object.keys(it.elements).concat('length');
    },
    getOwnPropertyDescriptor(_, prop): PropertyDescriptor | undefined {
      return Object.getOwnPropertyDescriptor(it.elements, prop);
    },
    set(_: unknown, prop: string): boolean {
      throw new TypeError(`Cannot assign to read only property '${prop.toString()}' of ArrayLikeIterator.`);
    },
    deleteProperty(_: unknown, prop: string): boolean {
      throw new TypeError(`Cannot delete property '${prop.toString()}' of ArrayLikeIterator.`);
    },
    defineProperty(_: unknown, prop: string): boolean {
      throw new TypeError(`Cannot define property '${prop.toString()}' of ArrayLikeIterator.`);
    },
  });
}

export default arrayLike;
