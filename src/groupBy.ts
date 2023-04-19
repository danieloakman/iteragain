import GroupByIterator from './internal/GroupByIterator';
import { IterSource, IteratorOrIterable, KeyIdentifier } from './internal/types';
import toIterator from './toIterator';

/** @todo // TODO: Implement */
export function groupBy<T extends IteratorOrIterable<any>, K extends KeyIdentifier<T>>(arg: T, key: KeyIdentifier<IterSource<T>> = v => v) {
  return new GroupByIterator(toIterator(arg), key);
}

export default groupBy;
