import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { length, range } from '.';

describe('length', () => {
  it('should return length of range(10)', async function () {
    equal(length(range(10)), 10);
  });

  it('should return zero for empty range', async function () {
    equal(length(range(0)), 0);
  });

  it('should return one for single-element range', async function () {
    equal(length(range(1)), 1);
  });

  it('should return length of large range', async function () {
    equal(length(range(100)), 100);
  });
});
