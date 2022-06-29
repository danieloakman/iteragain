import ExtendedIterator from './internal/ExtendedIterator';
import WindowsIterator from './internal/WindowsIterator';
import toIterator from './toIterator';
import { IteratorOrIterable, Tuple } from './internal/types';

export function windows<T, Length extends number>(
  arg: IteratorOrIterable<T>,
  length: Length,
  offset: number,
  fill?: T,
): ExtendedIterator<Tuple<T, Length>> {
  return new ExtendedIterator(new WindowsIterator(toIterator(arg), length, offset, fill)) as ExtendedIterator<
    Tuple<T, Length>
  >;
}

export default windows;
