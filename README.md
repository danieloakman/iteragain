
# [iteragain](https://www.npmjs.com/package/iteragain)

Another Javascript library for iterating.

Pure JavaScript, Iterable/Iterator/Generator-function utilities. No dependencies and shipped with types as is.

Iterators and Iterables in Javascript has basically no supporting methods or functions. This package provides easy to use, lazy evaluation methods to save on memory and unnecessary processing. Support with using the already existing `next()` method and usage in "for of" loops, this makes using Iterators as easy as using an Array.

This package can be used like in Python with standalone functions like [map](https://danieloakman.github.io/iteragain/functions/map.map.html), [filter](https://danieloakman.github.io/iteragain/functions/filter.filter.html), etc. Or be used with method chaining by calling [iter](https://danieloakman.github.io/iteragain/functions/iter.iter.html) which returns an instance of the [ExtendedIterator](https://danieloakman.github.io/iteragain/classes/internal_ExtendedIterator.ExtendedIterator.html) class. Either is supported for however you want to handle iterators.

See [iteragain-es](https://www.npmjs.com/package/iteragain-es) for the ES modules exported version of this package.

## Documentation

You can see the full list of modules and the documentation on everything [here](https://danieloakman.github.io/iteragain).

## Code examples

### A performance benefit over using Array's higher-order methods

```js
// This is an example of using Array higher-order methods.
// And this particular one will iterate over `someArray` 3 times.
const result1 = someArray.map(iteratee).filter(predicate).reduce(reducer);

// This example of using `iter` returns the same result, but it will only iterate over `someArray` once.
const result2 = iter(someArray).map(iteratee).filter(predicate).reduce(reducer).toArray();

equal(result1, result2); // Asserts that the results are the same.
```

### Basic use of `iter` and some standalone functions

```js
// Import from the root index
import { iter } from 'iteragain';
// Or from the file itself (tree shakeable):
import iter from 'iteragain/iter';
let nums = iter([1, 2, 3, 4, 5])
  .map(n => n * n)
  .filter(n => n % 2 === 0)
  .toArray();
  // [4, 16]
// Or use the standalone functions instead of `iter`:
import { map, filter, toArray } from 'iteragain';
nums = toArray(filter(map([1, 2, 3, 4, 5], n => n * n), n => n % 2 === 0)); // [4, 16]
```

### Using the `range` standalone function

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

### Iterating through any object's properties recursively

```js
import iter from 'iteragain/iter';
const obj = { a: 1, b: { c: 2, d: { e: 3 }, f: 4 } };
const keys = iter(obj)
  .map(([key, _value, _parent]) => key)
  .toArray();
  // ['a', 'c', 'e', 'd', 'b', 'f'] Post-order depth first search traversal of `obj`.
```

### Supports passing functions as input and using an optional sentinel value to stop iteration

```js
import iter from 'iteragain/iter';
const it = iter(() => someFunction(1, 2, 3), null)
// Will call `someFunction` with the arguments [1, 2, 3] for each iteration until it returns `null`:
const results = it.toArray();
```

### Accessing elements from an iterator with [arrayLike](https://danieloakman.github.io/iteragain/functions/arrayLike.arrayLike.html)

The `arrayLike` uses a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) that wraps a [seekable](https://danieloakman.github.io/iteragain/functions/seekable.seekable.html) iterator. This allows access to elements from the iterator. This can be useful when you may need to easily search behind the current element, then look ahead, or just access elements by index.

```js
import { arrayLike, range, iter, toArray } from 'iteragain';

const arr = arrayLike(iter(range(100)).map(n => n * n)); // Cached elements: []
arr.length; // Returns 0

arr[4]; // Returns 16. Cached elements: [0, 1, 4, 9, 16]
arr.length; // returns 5

arr[9]; // Returns 81. Cached elements: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
arr.length; // Returns 10

// Negative indices are supported, because internally it's just a seekable.
// This will seek starting from the end of the internal cache.
arr[-1]; // Returns 81. Cached elements: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
arr.length; // Returns 10

// All other array methods are supported, as it's of type `readonly number[]`.
// Including using it as an iterable:
for (const n of arr) {
  console.log(n);
  if (n > 20) break;
}

// Exhausts the iterator wrapped inside of `arr`. `collected` is just a regular array.
const collected = toArray(arr);
```

## Inpired by

[iterplus](https://www.npmjs.com/package/iterplus), [iterare](https://www.npmjs.com/package/iterare), [lodash](https://www.npmjs.com/package/lodash), [rxjs](https://www.npmjs.com/package/rxjs), [ixjs](https://www.npmjs.com/package/ix) and the Python [itertools](https://docs.python.org/3/library/itertools.html) and [more-itertools](https://pypi.org/project/more-itertools/) modules. See benchmark section for performance against some of these.

## Benchmark

```md
Starting benchmark suite: index.bm.ts
  for of loop x 2,015 ops/sec, ±47 ops/sec or ±2.33% (90 runs sampled)
  iteragain x 1,431 ops/sec, ±25 ops/sec or ±1.74% (92 runs sampled)
  iterare x 1,368 ops/sec, ±20 ops/sec or ±1.48% (95 runs sampled)
  rxjs x 989 ops/sec, ±10 ops/sec or ±1.05% (93 runs sampled)
```
