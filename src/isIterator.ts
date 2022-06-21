/**
 * Returns true if `arg` implements the ES6 "Iterator"/"Generator" interface, i.e. it has a `next` method that
 * returns `{ done: boolean, value: any }`.
 */
export function isIterator(arg: any): arg is Iterator<any> {
  return typeof arg?.next === 'function';
}
export default isIterator;
