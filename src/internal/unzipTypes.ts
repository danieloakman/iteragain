import type ExtendedIterator from './ExtendedIterator';

type UnzipWrap<V, Wrap extends 'iter' | 'extended'> = Wrap extends 'extended'
  ? ExtendedIterator<V>
  : IterableIterator<V>;

type UnzipColumnsRec<
  Row,
  Wrap extends 'iter' | 'extended',
  Acc extends readonly unknown[] = [],
> = Row extends readonly [infer H, ...infer R]
  ? R extends readonly []
    ? Acc extends readonly []
      ? [UnzipWrap<Row, Wrap>]
      : [...Acc, UnzipWrap<H, Wrap>]
    : UnzipColumnsRec<R, Wrap, [...Acc, UnzipWrap<H, Wrap>]>
  : [UnzipWrap<Row, Wrap>];

/** Maps each column of row tuple `Row` to standalone iterators. */
export type UnzipResult<Row> = UnzipColumnsRec<Row, 'iter'>;

/** Maps each column of row tuple `Row` to extended iterators. */
export type UnzipExtendedResult<Row> = UnzipColumnsRec<Row, 'extended'>;
