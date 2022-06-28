
# iteragain

Another Javascript library for iterating.

Pure JavaScript, ES6 Iterable/Iterator utilities. No dependencies and shipped with types as is.

Inspired by [iterplus](https://www.npmjs.com/package/iterplus), [iterare](https://www.npmjs.com/package/iterare) and the Python [itertools](https://docs.python.org/3/library/itertools.html) module. See benchmark section for performance.

The package is designed around the use of the `ExtendedIterator` class. It's a class that extends the ES6 Iterator with methods like those in `Array` and other iterator methods in python. It's chainable and looks closely like normal Javascript code instead of the more Python `itertools` way of doing things:
`filter(lambda x: x % 2 == 0, map(lambda x: x * x, iterable))`

There is also other utility functions like `range`, `enumerate`, etc.

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
let r = range(10);
r.length; // 10, (a readonly property)
r.includes(5); // true
r.nth(-1); // 9 (the last element)
r.nth(1); // 1 (the second element)
r.nth(10); // undefined (the 10th element doesn't exist)
let r = range(3);
const nums = [...r, ...r]; // [0, 1, 2, 0, 1, 2], can be reused after a full iteration.
```

## Benchmark

```
Starting benchmark suite: index.bm.ts
  for of loop x 2,015 ops/sec, ±47 ops/sec or ±2.33% (90 runs sampled)
  iteragain x 1,431 ops/sec, ±25 ops/sec or ±1.74% (92 runs sampled)
  iterare x 1,368 ops/sec, ±20 ops/sec or ±1.48% (95 runs sampled)
  rxjs x 989 ops/sec, ±10 ops/sec or ±1.05% (93 runs sampled)
```
