/* asyncify(isAsyncIterable) */
/* ra(isIterable, isAsyncIterable) */
/* ra(' Iterable', ' AsyncIterable') */
/* ra('Symbol.iterator', 'Symbol.asyncIterator') */

/** Returns true if `arg` implements the `Symbol.iterator`, i.e. it's able to be passed to a `for of` loop. */
export function isIterable(arg: any): arg is Iterable<any> {
  return typeof arg?.[Symbol.iterator] === 'function';
}

export default isIterable;
