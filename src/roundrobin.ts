import ExtendedIterator from './internal/ExtendedIterator';
import { IteratorOrIterable } from './internal/types';
import RoundrobinIterator from './internal/RoundrobinIterator';
import toIterator from './toIterator';

export function roundrobin(...iteratorOrIterables: IteratorOrIterable<any>[]): ExtendedIterator<any> {
  return new ExtendedIterator(new RoundrobinIterator(iteratorOrIterables.map(toIterator)));
}

export default roundrobin;
