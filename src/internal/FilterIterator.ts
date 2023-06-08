/**
 * An iterator that filters the values from the input Iterator<T>, to only those that return a truthy value in the
 * `predicate`.
 */
export class FilterIterator<T> implements IterableIterator<T> {
  constructor(protected iterator: Iterator<T>, protected predicate: (value: T) => any) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(...args: any[]): IteratorResult<any> {
    let result: IteratorResult<T>;
    do result = this.iterator.next(...(args as any));
    while (!result.done && !this.predicate(result.value));
    return result;
  }
}

export default FilterIterator;
