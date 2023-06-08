/**
 * Creates a iterator from any function. `func` will be called once per `next()` call and will stop once the value of
 * `sentinel` (default: undefined) is returned from `func`. Behaves similarly to a generator function, except without
 * the use of `yield` statements.
 */
export class FunctionIterator<TFunc extends (...args: any[]) => any, TSentinel = undefined> {
  constructor(protected func: TFunc, protected sentinel?: TSentinel) {}

  [Symbol.iterator]() {
    return this;
  }

  /** Works like any generator function `next` method */
  next(
    ...args: Parameters<TFunc>
  ): IteratorResult<Exclude<ReturnType<TFunc>, TSentinel>, Exclude<ReturnType<TFunc>, TSentinel>> {
    const result = this.func(...args);
    return result === this.sentinel
      ? ((this.func = (() => this.sentinel) as any), { done: true, value: undefined })
      : ({ done: false, value: result } as any);
  }
}

export default FunctionIterator;
