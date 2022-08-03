
# [iteragain](https://www.npmjs.com/package/iteragain)

Another Javascript library for iterating.

Pure JavaScript, Iterable/Iterator/Generator-function utilities. No dependencies and shipped with types as is.

Iterators and Iterables in Javascript has basically no supporting methods or functions. This package provides easy to use, lazy evaluation methods to save on memory and unnecessary processing. Support with using the already existing `next()` method and usage in "for of" loops, this makes using Iterators as easy as using an Array.

The package is designed around the use of the [ExtendedIterator](https://danieloakman.github.io/iteragain/classes/internal_ExtendedIterator.ExtendedIterator.html) class through calling [iter()](https://danieloakman.github.io/iteragain/functions/iter.iter.html). It's a class that implements and extends the [IterableIterator](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es2015_iterable_d_.iterableiterator.html) interface. Methods in this class are designed to provide all of what you can do in the normal [JS Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and the iterator methods in Python. This class is chainable and looks closely like normal Javascript code instead of the more Python [itertools](https://docs.python.org/3/library/itertools.html) way of doing things:
`filter(lambda x: x % 2 == 0, map(lambda x: x * x, iterable))`

There is also other standalone utility functions like [range](https://danieloakman.github.io/iteragain/functions/range.range.html), [enumerate](https://danieloakman.github.io/iteragain/functions/enumerate.enumerate.html), [zip](https://danieloakman.github.io/iteragain/functions/zip.zip.html)...

__You can see the full list of modules and the documentation on everything [here](https://danieloakman.github.io/iteragain/modules.html).__

See [iteragain-es](https://www.npmjs.com/package/iteragain-es) for the ES modules exported version of this package.

## Code examples

```js
// This is an example of using Array higher-order methods.
// And this particular one will iterate over `someArray` 3 times.
const result1 = someArray.map(iteratee).filter(predicate).reduce(reducer);

// This example of using `iter` returns the same result, but it will only iterate over `someArray` once.
const result2 = iter(someArray).map(iteratee).filter(predicate).reduce(reducer).toArray();

equal(result1, result2); // Asserts that the results are the same.
```

```js
// Import from the root index
import { iter } from 'iteragain';
// Or from the file itself (tree shakable):
import iter from 'iteragain/iter';
const nums = iter([1, 2, 3, 4, 5])
  .map(n => n * n)
  .filter(n => n % 2 === 0)
  .toArray();
  // [4, 16]
```

```js
import range from 'iteragain/range';
range(10).toArray(); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
range(10, 0).toArray(); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
range(0, -10).toArray(); // [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
range(0, 10, 2).toArray(); // [0, 2, 4, 6, 8]
let r = range(3);
const nums = [...r, ...r]; // [0, 1, 2, 0, 1, 2], can be reused after a full iteration.
r = range(0, 10, 2);
// The following methods do not iterate/access the internal iterator:
r.length; // 10, (a readonly property)
r.includes(4); // true
r.nth(-1); // 8 (the last element)
r.nth(1); // 2 (the second element)
r.nth(10); // undefined (the 10th element doesn't exist)
r.index(4); // 2 (the index of the value 4)
```

```js
import iter from 'iteragain/iter';
const obj = { a: 1, b: { c: 2, d: { e: 3 }, f: 4 } };
const keys = iter(obj)
  .map(([key, _value, _parent]) => key)
  .toArray();
  // ['a', 'c', 'e', 'd', 'b', 'f'] Post-order depth first search traversal of `obj`.
```

## Inpired by

[iterplus](https://www.npmjs.com/package/iterplus), [iterare](https://www.npmjs.com/package/iterare), [lodash](https://www.npmjs.com/package/lodash), [rxjs](https://www.npmjs.com/package/rxjs) and the Python [itertools](https://docs.python.org/3/library/itertools.html) module. See benchmark section for performance against some of these.

## Benchmark

```
Starting benchmark suite: index.bm.ts
  for of loop x 2,015 ops/sec, ±47 ops/sec or ±2.33% (90 runs sampled)
  iteragain x 1,431 ops/sec, ±25 ops/sec or ±1.74% (92 runs sampled)
  iterare x 1,368 ops/sec, ±20 ops/sec or ±1.48% (95 runs sampled)
  rxjs x 989 ops/sec, ±10 ops/sec or ±1.05% (93 runs sampled)
```
