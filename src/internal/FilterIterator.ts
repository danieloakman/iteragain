/**
 * An iterator that filters the values from the input Iterator<T>, to only those that return a truthy value in the
 * `predicate`.
 */
export class FilterIterator<T> implements Iterator<T> {
  constructor(protected iterator: Iterator<T>, protected predicate: (value: T) => any) {}

  next(): IteratorResult<any> {
    let result: IteratorResult<T>;
    do result = this.iterator.next();
    while (!result.done && !this.predicate(result.value));
    return result;
  }
}

export default FilterIterator;
