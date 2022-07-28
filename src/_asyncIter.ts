/* eslint-disable no-console */
class AsyncExtendedIterator<T> implements AsyncIterableIterator<T> {
  constructor(protected iterator: AsyncIterator<T>) {}

  [Symbol.asyncIterator]() {
    return this;
  }

  *[Symbol.iterator]() {
    let next: Promise<IteratorResult<T>>;
    while ((next = this.iterator.next())) yield next.then(({ value }: { value: T }) => value);
  }

  public next(): Promise<IteratorResult<T>> {
    return this.iterator.next();
  }

  public map<R>(iteratee: (value: T) => R): AsyncExtendedIterator<R> {
    return new AsyncExtendedIterator({
      next: () => this.iterator.next().then(({ done, value }) => ({ done, value: done ? undefined : iteratee(value) })),
    });
  }

  public async toArray(): Promise<T[]> {
    const values: T[] = [];
    let next: IteratorResult<T>;
    while (!(next = await this.iterator.next()).done) values.push(next.value);
    return values;
  }
}
type AsyncIterableOrIterator<T> = AsyncIterable<T> | AsyncIterator<T>;

function isAsyncIterator<T>(arg: any): arg is AsyncIterator<T> {
  return arg && typeof arg.next === 'function';
}

function isAsyncIterable<T>(arg: any): arg is AsyncIterable<T> {
  return typeof arg?.[Symbol.asyncIterator] === 'function';
}

function toAsyncIterator<T>(arg: AsyncIterableOrIterator<T>): AsyncIterator<T> {
  if (isAsyncIterator(arg)) return arg;
  if (isAsyncIterable(arg)) return arg[Symbol.asyncIterator]();
  throw new Error('`arg` could not be coerded into an AsyncIterator');
}

export function asyncIter<T>(arg: AsyncIterableOrIterator<T>): AsyncExtendedIterator<T> {
  return new AsyncExtendedIterator(toAsyncIterator(arg));
}

function interval(period: number): AsyncExtendedIterator<number> {
  return new AsyncExtendedIterator(new IntervalIterator(period));
}

class IntervalIterator implements AsyncIterator<number> {
  protected i = 0;

  constructor(protected period = 0) {}

  next(): Promise<IteratorResult<number, any>> {
    return new Promise(resolve => setTimeout(() => resolve({ done: false, value: this.i++ }), this.period));
  }
}

export default asyncIter;

(async () => {
  // for await (const i of interval(1000).map(n => n * 2))
  //   console.log(i);
  for (const i of interval(1000)) console.log(await i);
})();
