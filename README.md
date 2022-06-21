
# iterutil

Pure JavaScript, ES6 Iterable/Iterator utilities. No dependencies and shipped with types as is.

Inspired by [iterplus](https://www.npmjs.com/package/iterplus), [iterare](https://www.npmjs.com/package/iterare) and the Python [itertools](https://docs.python.org/3/library/itertools.html) module.

The package is designed around the use of the `ExtendedIterator` class. It's a class that extends the ES6 Iterator with methods like those in `Array` and other iterator methods in python. It's chainable and looks closely like normal Javascript code instead of the more Python `itertools` way of doing things:
`filter(lambda x: x % 2 == 0, map(lambda x: x * x, iterable))`

There is also other utility functions like `range`, `enumerate`, etc.

## Code demo

```js
// Import from the root index
import { iter } from 'iterutil';
// Or from the file itself (tree shakable):
import iter from 'iterutil/iter';

const nums = iter([1, 2, 3])
  .map(n => n ** n)
  .filter(n => n % 2 === 0)
  .toArray();
  // [1, 4, 9]
```
