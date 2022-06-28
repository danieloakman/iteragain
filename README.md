
# iteragain

Another Javascript library for iterating.

Pure JavaScript, Iterable/Iterator/Generator-function utilities. No dependencies and shipped with types as is.

The package is designed around the use of the [ExtendedIterator](https://danieloakman.github.io/iteragain/classes/ExtendedIterator.ExtendedIterator-1.html) class through calling [iter](https://danieloakman.github.io/iteragain/functions/iter.iter-1.html). It's a class that implements and extends the [IterableIterator](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es2015_iterable_d_.iterableiterator.html) interface. It provides extra methods like those in the [JS Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and other iterator methods in Python. It's chainable and looks closely like normal Javascript code instead of the more Python [itertools](https://docs.python.org/3/library/itertools.html) way of doing things:
`filter(lambda x: x % 2 == 0, map(lambda x: x * x, iterable))`

There is also other utility functions like `range`, `enumerate`, `zip` etc.

See [documentation](https://danieloakman.github.io/iteragain/).

## Code demo

```js
// Import from the root index
import { iter } from 'iteragain';
// Or from the file itself (tree shakable):
import iter from 'iteragain/iter';
const nums = iter([1, 2, 3])
  .map(n => n * n)
  .filter(n => n % 2 === 0)
  .toArray();
  // [1, 4, 9]
```

```js
import range from 'iteragain/range';
range(10).toArray(); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
range(10, 0).toArray(); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
range(0, -10).toArray(); // [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
range(0, 10, 2).toArray(); // [0, 2, 4, 6, 8]
let r = range(0, 10, 2);
r.length; // 10, (a readonly property)
r.includes(4); // true
r.nth(-1); // 8 (the last element)
r.nth(1); // 2 (the second element)
r.nth(10); // undefined (the 10th element doesn't exist)
r.index(4); // 2 (the index of the value 4)
r = range(3);
const nums = [...r, ...r]; // [0, 1, 2, 0, 1, 2], can be reused after a full iteration.
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
