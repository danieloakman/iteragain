import FunctionIterator from './internal/FunctionIterator';
import SliceIterator from './internal/SliceIterator';

/**
 * Functionally the same as `String.prototype.split` except this splits `str` lazily.
 * @param str The string to split.
 * @param separator The separator to split on. Either a `string` or `RegExp`.
 * @param limit The maximum number of splits to return. This is here
 */
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
