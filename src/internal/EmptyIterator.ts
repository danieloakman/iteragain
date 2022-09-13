/** An Iterator object that yields nothing. */
export class EmptyIterator implements IterableIterator<never> {
  [Symbol.iterator](): IterableIterator<never> {
    return this;
  }

  next(): IteratorResult<never> {
    return { done: true, value: undefined };
  }
}

export default EmptyIterator;
