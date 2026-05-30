import type { IteratorOrIterable } from './types';
import type { UnzipResult } from './internal/unzipTypes';
import spy from './spy';
import tee from './tee';
import map from './map';

/**
 * The inverse of `zip` and `zipLongest`. This function disaggregates the elements of the input iterator. The nth
 * iterator in the returned tuple contains the nth element of each value in the input iterator. The length of the
 * returned tuple is determined by the length of the first value in the input iterator.
 */
export function unzip<Row>(arg: IteratorOrIterable<Row>): UnzipResult<Row> {
  const [[head], it] = sypy(arg);
  const n = Array.isArray(head) ? head.length : 1;
  if (n < 2) return [it] as UnzipResult<Row>;
  return tee(it, n).map((it, i) => map(it, v => (v as any)[i])) as UnzipResult<Row>;
}

export default unzip;
