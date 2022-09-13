/**
 * Creates an iterator from any function. `func` will be called once per `next()` call and will stop once the value of
 * `sentinel` (default: undefined) is returned from `func`.
 */
export class FunctionIterator<TFunc extends (...args: any[]) => any> implements IterableIterator<ReturnType<TFunc>> {
  constructor(protected func: TFunc, protected sentinel?: ReturnType<TFunc>) {}

  [Symbol.iterator](): IterableIterator<ReturnType<TFunc>> {
    return this;
  }

  next(): IteratorResult<ReturnType<TFunc>> {
    const result = this.func();
    // if (result === this.sentinel) {
    //   this.func = () => this.sentin
    //   return { done: true, value: undefined };
    // }
    return result === this.sentinel
      ? (this.func = (() => this.sentinel) as any, { done: true, value: undefined })
      : { done: false, value: result };
  }
}

export default FunctionIterator;
