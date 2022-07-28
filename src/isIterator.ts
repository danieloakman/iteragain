/* asyncable:isAsyncIterator */

/** Returns true if `arg` implements the "Iterator" interface, i.e. it has a `next` method. */
export function isIterator(arg: any): arg is /*i:Async*/Iterator<any> {
  return typeof arg?.next === 'function';
}
export default isIterator;
