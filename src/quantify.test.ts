import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { pipe, quantify, range } from '.';

describe('quantify', () => {
  it('counts elements matching predicate in range', async function () {
    equal(
      quantify(range(10), n => n % 2 === 0),
      5,
    );
  });

  it('counts even numbers in sliced range via pipe', async function () {
    equal(
      pipe(
        range(5, 50),
        quantify(n => n % 2 === 0),
      ),
      22,
    );
  });
});
