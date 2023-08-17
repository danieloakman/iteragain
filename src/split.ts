import FunctionIterator from './internal/FunctionIterator';
import SliceIterator from './internal/SliceIterator';

/** @todo // TODO: Implement */
export function split(str: string, separator: string | RegExp, limit?: number): IterableIterator<string> {
  const fnIt = new FunctionIterator(() => {
    if (!str.length) return;

    const index = str.search(separator);
    if (index === -1) {
      const result = str;
      str = '';
      return result;
    }

    const result = str.slice(0, index);
    str = str.slice(index + 1);
    return result;
  });

  return limit ? new SliceIterator(fnIt, 0, limit) : fnIt;
}

export default split;
