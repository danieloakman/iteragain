/** @todo Fully implement this Iterator. */
export class ObjectIterator implements IterableIterator<[any, PropertyKey, any]> {
  protected arr: ([any, PropertyKey, any]|[any, PropertyKey, any, boolean])[] = [];

  constructor(object: any, protected reverse = false) {
    this.unshift(object);
  }

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  public next(): IteratorResult<[any, PropertyKey, any]> {
    if (this.arr.length) {
      if (!this.reverse) {
        const value = this.arr.pop() as [any, PropertyKey, any];
        if (this.isObject(value[0])) this.unshift(value[0]);
        return { done: false, value };
      }
      const value = this.arr.shift();
      if (value.length === 4)
        return { done: false, value: value.slice(0, 2) as [any, PropertyKey, any] };
      if (this.isObject(value[0])) {
        this.arr.unshift([...value, true]);
        this.unshift(value[0]);
        return this.next();
      }
      return { done: false, value };
    }
    return { done: true, value: undefined };
  }

  protected isObject(value: any): value is NonNullable<object> {
    return typeof value === 'object' && value !== null;
  }

  protected push(obj: any) {
    for (const key of Object.keys(obj)) this.arr.push([obj[key], key, obj]);
  }

  protected unshift(obj: any) {
    for (const key of Object.keys(obj)) this.arr.unshift([obj[key], key, obj]);
  }
}

export default ObjectIterator;

/**
 * Iterates over `Object.keys(object)` and recursively any nested objects within `object`. This is similar to
 * `forEachObject` except this utilises Generators and the 'iterare' package instead of just callbacks.
 * @param object Any object or array.
 * @note Traverses in DFS order.
 */
export function* iterateObject(object: any): IterableIterator<{ value: any; key: PropertyKey; object: any }> {
  for (const key of Object.keys(object)) {
    if (typeof object[key] === 'object' && object[key] !== null) yield* iterateObject(object[key]);
    yield { value: object[key], key, object };
  }
}
