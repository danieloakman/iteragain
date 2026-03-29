import type { IteratorOrIterable, Awaited } from './types';
import toIterator from './toIterator';
import toArray from './toArray';

/** Calls `Promise.all` on all collected values, optionally limiting concurrent in-flight promises. */
export async function promiseAll<T>(
  arg: IteratorOrIterable<T>,
  { concurrency = Infinity }: { concurrency?: number } = {},
): Promise<Awaited<T>[]> {
  if (concurrency <= 0) throw new Error('Concurrency must be positive');
  if (concurrency === Infinity) return Promise.all(toArray(arg)) as Promise<Awaited<T>[]>;
  const results: T[] = [];
  const executing = new Set<Promise<unknown>>();
  const iterator = toIterator(arg);

  let next: IteratorResult<T>;
  while (!(next = iterator.next()).done) {
    const promise = next.value;
    results.push(promise);

    const executingPromise = Promise.resolve(promise).finally(() => {
      executing.delete(executingPromise);
    });
    executing.add(executingPromise);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results) as Promise<Awaited<T>[]>;
}

export default promiseAll;
