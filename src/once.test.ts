import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import once from './once';
import { pipe } from './pipe';

describe('once', () => {
  it('should yield a value exactly once', async function () {
    equal([...once(42)], [42]);
  });

  it('should support curried invocation', async function () {
    equal([...once()(42)], [42]);
    equal([...once()('x')], ['x']);
  });

  it('should work with pipe when curried', async function () {
    equal([...pipe(42, once)], [42]);
  });

  it('should yield undefined when value is undefined', async function () {
    equal([...once(undefined)], [undefined]);
  });
});
