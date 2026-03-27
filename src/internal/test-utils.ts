import { deepStrictEqual, notDeepStrictEqual } from 'assert';

/** Type-only helper for assertions in tests. */
export const expectType = <T>(value: T): T => value;

/** Assert deep equality with aligned generic types. */
export const equal = <T>(actual: T, expected: T, message?: string | Error): void =>
  deepStrictEqual(actual, expected, message);

export const notEqual = <T>(actual: T, expected: T, message?: string | Error): void =>
  notDeepStrictEqual(actual, expected, message);

export { ok as assert, throws } from 'assert';
