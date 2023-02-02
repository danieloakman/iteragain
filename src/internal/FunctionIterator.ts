/**
 * Creates an iterator from any function. `func` will be called once per `next()` call and will stop once the value of
 * `sentinel` (default: undefined) is returned from `func`.
 */
export class FunctionIterator<TFunc extends (...args: any[]) => any>  {
  constructor(protected func: TFunc, protected sentinel?: ReturnType<TFunc>) {}

  [Symbol.iterator]() {
    return this;
  }

  next(...args: Parameters<TFunc>): IteratorResult<ReturnType<TFunc>> {
    const result = this.func(...args);
    return result === this.sentinel
      ? (this.func = (() => this.sentinel) as any, { done: true, value: undefined })
      : { done: false, value: result };
  }
}

export default FunctionIterator;
