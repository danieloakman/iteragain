/** An Iterator object that yields nothing. */
export class EmptyIterator implements Iterator<never> {
  next(): IteratorResult<never> {
    return { done: true, value: undefined };
  }
}

export default EmptyIterator;
