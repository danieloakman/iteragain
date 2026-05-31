# iteragain Code Review

Review date: 2026-05-30  
Last updated: 2026-05-31  
Scope: `src/` (implementation, tests, packaging, docs)  
Test status: **122 tests passing** (`bun test ./src`), `bun run check` clean

---

## Remaining open items

| # | Item | Severity | Notes |
|---|------|----------|-------|
| **10** | `CycleIterator` pushes `undefined` on final exhaustion | Low | When cycles are exhausted, terminal path may still push `undefined` into the internal buffer. Cosmetic; infinite-loop case is fixed. |
| **12** | Eager materialization in “lazy” chains | Info | `reverse`, `sort`, `shuffle`, `divide`, `permutations`, `combinations`, `product`, `promiseRace`/`promiseAll` fully buffer upstream. Fine for finite data; easy to misuse on streams. |
| **13** | `tee` memory grows with the slowest branch | Info | Documented. Branches that diverge in speed retain cached values until all pass them. |
| **15** | Iterator pipeline overhead vs native loops | Info | ~1.5× slower than `for…of` at ~10k elements (`src/benchmark/index.bm.ts`). Expected abstraction cost. |
| **16** | `range(1, 0)` returns `[1]` (not Python-empty) | Product | Documented in JSDoc. Breaking change if aligned with Python 3. |
| **17** | `flatten` / `flatMap` do not flatten strings | By design | Lodash-style: strings are atomic. Documented in README, JSDoc on `flatten` / `flatMap`, and `ExtendedIterator`. |
| **18** | `groupBy` uses reference equality for keys | By design | Matches Python `itertools.groupby`; differs from `unique` (`Set`). |
| **19** | `FunctionIterator` is single-use after sentinel | By design | `func` is replaced after sentinel; construct a new instance to restart. |

### Suggested priority

1. **Low:** Clean up terminal `undefined` push in `CycleIterator` (#10).
2. **Product decision:** Python `range` parity (#16).
3. **Documentation:** Eager materialization (#12), `tee` memory (#13).

---

## Resolved (2026-05-30 – 2026-05-31)

| # | Item | Commit / notes |
|---|------|----------------|
| 1 | `cycle([])` infinite loop | `c0f819eb` |
| 2 | `tee` / `seekable` mishandle `undefined` | `c0f819eb`, `9e69609d` |
| 3 | `chunks(0)` infinite loop | `c0f819eb` |
| 4 | `windows(0, …)` infinite loop | `c0f819eb` |
| 5 | `SeekableIterator` cannot round-trip cached `undefined` | `c0f819eb` |
| 6 | `unique({ justSeen: true })` falsy handling | `07d1e32d` |
| 7 | `permutations(iterable)` one-arg currying | `07d1e32d` |
| 8 | `shuffle` out-of-bounds seed injects `undefined` | `07d1e32d` |
| 9 | Empty `reduce` / `min` / `max` / `minmax` throw | `07d1e32d` |
| 11 | `reverse` O(n²) via `unshift` | `07d1e32d` |
| 14 | `SeekableIterator` `maxLength` eviction / index drift | `9e69609d` — `base` offset tracks evicted window |
| 21 | `unzip` return types | `07d1e32d` — `UnzipResult` / `UnzipExtendedResult` |
| 22 | Conflicting `package.json` `types` entry | `de7d5c96` |
| 23 | `format` script scope | `de7d5c96` |
| 24 | README typo | earlier session |

Changelog fragments for the resolved items are in `.changes/unreleased/`.

---

## Code TODOs (informational)

| File | Note |
|------|------|
| `src/arrayLike.ts` | Overload for passing an existing `seekable` + `maxLength` |
| `src/product.ts` | Currying support |
| `src/internal/ObjectIterator.ts` | BFS traversal order |
| `src/internal/CachedIterator.ts` | Deprecated in favor of `SeekableIterator` |

---

## What is working well

- **Lazy iterator composition** through small internal iterator classes.
- **Tree-shakeable** subpath exports and `sideEffects: false`.
- **No runtime dependencies.**
- **TypeScript strict mode** with explicit return types in production code.
- **Benchmark infrastructure** for iterare, rxjs, ixjs.
- **Documentation** (Typedoc + README) including honest notes on `tee` memory and `reverse` materialization.
