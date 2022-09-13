import RoundrobinIterator from './internal/RoundrobinIterator';
import { IteratorOrIterable, IterSource } from './internal/types';
import toIterator from './toIterator';

/** Creates a new iterable that yields values from each iterator in `args` in an alternating fashion. */
export function roundrobin<T extends IteratorOrIterable<any>[]>(...args: T): IterableIterator<IterSource<T[number]>> {
  return new RoundrobinIterator(args.map(v => toIterator(v) as Iterator<IterSource<T[number]>>)) as IterableIterator<
    IterSource<T[number]>
  >;
}

export default roundrobin;
