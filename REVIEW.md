# iteragain Code Review

Review date: 2026-05-30  
Last updated: 2026-05-31  
Scope: `src/` (implementation, tests, packaging, docs)  
Test status: **122 tests passing** (`bun test ./src`), `bun run check` clean

This document summarizes bugs, performance concerns, API pitfalls, and improvement opportunities found during a static and behavioral review of the codebase.

---

## Resolution status

| Status | Count | Items |
|--------|-------|-------|
| **Fixed** | 18 | #1–9, #11, #21–24 (see below) |
| **Open** | 6 | #10, #12–20 |
| **Informational** | — | Code TODOs, documented trade-offs |

### Fix timeline

| When | Commit / session | Items |
|------|------------------|-------|
| 2026-05-30 | `c0f819eb` — “Fix some edge case errors” | #1–5, #3–4 tests |
| 2026-05-30–31 | Follow-up session | #6–9, #11, #21–24 |

---

## Summary (original findings)

| Severity | Original count | Remaining |
|----------|----------------|-----------|
| Critical | 4 | 0 |
| High | 6 | 1 (#10, minor) |
| Medium | 8 | 5 (#12–16; #11 fixed) |
| Low | 6 | 0 (#21–24 fixed; tests added) |

---

## Critical bugs

### 1. `cycle` on an empty iterator hangs forever — **FIXED**

**Location:** `src/internal/CycleIterator.ts`

When the source iterator is empty and `times` is `Infinity` (the default), `next()` used to recurse forever. Now returns `{ done: true }` immediately when no values were collected.

**Fix:** Guard with `!this.values.length` before re-cycling.  
**Tests:** `src/cycle.test.ts`

---

### 2. `tee` treats `undefined` values as exhaustion — **FIXED**

**Location:** `src/internal/TeedIterator.ts`

Previously conflated “value is `undefined`” with “iterator exhausted”. `TeedIterator` now tracks exhaustion via index vs cache length instead of `value === undefined`.

**Tests:** `src/tee.test.ts` (includes `[undefined, 1, undefined, 2]`)

---

### 3. `chunks(0)` infinite loop — **FIXED**

**Location:** `src/internal/ChunksIterator.ts`

**Fix:** Throws `RangeError('length must be greater than 0')` in the constructor.  
**Tests:** `src/chunks.test.ts`

---

### 4. `windows(0, …)` infinite loop — **FIXED**

**Location:** `src/internal/WindowsIterator.ts`

**Fix:** Throws `RangeError` for `length <= 0` or `offset <= 0` in the constructor.  
**Tests:** `src/windows.test.ts`

---

## High-severity correctness issues

### 5. `SeekableIterator` cannot round-trip cached `undefined` values — **FIXED**

**Location:** `src/internal/SeekableIterator.ts`

Previously used `cachedValue !== undefined` to detect cache hits. Now uses index bounds (`this.i < this.cache.length`) and an `iteratorDone` flag.

**Tests:** `src/seekable.test.ts`

---

### 6. `unique({ justSeen: true })` mishandles falsy values — **FIXED**

**Location:** `src/unique.ts`, `src/internal/ExtendedIterator.ts`

**Fix:** Replaced `!lastValue` check with a `hasLastValue` boolean flag.  
**Tests:** `src/unique.test.ts` (cases for `0`, `''`, `false`)

---

### 7. `permutations` single-argument call is always curried — **FIXED**

**Location:** `src/permutations.ts`

**Fix:** Currying now dispatches on `typeof args[0] === 'number'` (matching `combinations`). Single iterable arg uses default size from input length. Added type overload for the one-arg form.  
**Tests:** `src/permutations.test.ts`

---

### 8. `shuffle` with `seed >= 1` injects `undefined` into output — **FIXED**

**Location:** `src/shuffle.ts`, `src/internal/ExtendedIterator.ts`

**Fix:** Swap index clamped with `Math.min(i, Math.max(0, Math.floor(seed * (i + 1))))`.  
**Tests:** `src/shuffle.test.ts` (asserts no `undefined` for boundary seeds)

---

### 9. `reduce` / `min` / `max` / `minmax` on empty iterators — **FIXED**

**Location:** `src/reduce.ts`, `src/min.ts`, `src/max.ts`, `src/minmax.ts`, `src/internal/ExtendedIterator.ts`, `src/internal/emptyIteratorError.ts`

**Fix:** Empty iterators now throw `TypeError`:

| Method | Error message |
|--------|---------------|
| `reduce` (no initial) | `Reduce of empty iterator with no initial value` |
| `min` | `Min of empty iterator` |
| `max` | `Max of empty iterator` |
| `minmax` | `Minmax of empty iterator` |

`reduce` with an `initialValue` on an empty iterator returns the initial value (matches `Array.prototype.reduce`). `join()` on an empty iterator returns `''`.

**Tests:** `src/reduce.test.ts`, `src/min.test.ts`, `src/max.test.ts`, `src/minmax.test.ts`, `ExtendedIterator.test.ts`

---

### 10. `CycleIterator` pushes `undefined` on final exhaustion — **OPEN**

**Location:** `src/internal/CycleIterator.ts`

When the source is exhausted and no more cycles remain, the old path could push `next.value` (`undefined`) into the internal buffer. The infinite-loop fix prevents the worst case; minor buffer pollution on terminal exhaustion may still occur. Low priority.

---

## Performance concerns

### 11. `reverse` uses `Array.unshift` — O(n²) time — **FIXED**

**Location:** `src/reverse.ts`, `ExtendedIterator.reverse()`

**Fix:** Collect with `push`, then `reverse()` in place — O(n) time.

---

### 12. Eager materialization in several “lazy” chains — **OPEN (documented trade-off)**

These methods fully consume the upstream iterator (documented in some cases, but worth noting for large/infinite inputs):

| Method | Location | Behavior |
|--------|----------|----------|
| `reverse` | `reverse.ts` | Full buffer |
| `sort` | `sort.ts` / `ExtendedIterator` | `toArray()` + sort |
| `shuffle` | `shuffle.ts` | `toArray()` + in-place swaps |
| `divide` | `divide.ts` | `toArray()` + slice |
| `permutations` / `combinations` | internal iterators | `toArray()` on input |
| `product` | `ProductIterator` | `toArray()` on each pool |
| `promiseRace` / `promiseAll` (default) | `promiseRace.ts`, `promiseAll.ts` | `toArray()` before awaiting |

This is acceptable for finite data but easy to misuse on generators or streams.

---

### 13. `tee` memory grows with the slowest branch — **OPEN (documented)**

**Location:** `src/tee.ts`, `SeekableIterator`, `TeedIterator`

Documented, but important: parallel branches that diverge in consumption speed retain all cached values until all branches pass them. For long iterators, `toArray()` + re-iteration may be faster than `tee(n)` when one branch reads far ahead.

---

### 14. `SeekableIterator` with bounded `maxLength` does not adjust read index after eviction — **OPEN**

**Location:** `src/internal/SeekableIterator.ts` (`add` shifts cache, but `i` is unchanged)

When the cache exceeds `maxLength`, `shift()` removes the oldest entry without decrementing `i`. Indices and cached content can drift. Seeking backward after eviction may return wrong elements or `undefined`. The test suite only covers forward iteration with `maxLength`.

---

### 15. Iterator pipeline overhead vs native loops — **OPEN (expected)**

Benchmarks in `src/benchmark/index.bm.ts` (~10k elements) show native `for…of` roughly **1.5× faster** than `iteragain` chaining. This is expected abstraction cost, but hot paths may still prefer standalones or plain loops.

---

## API design and behavioral pitfalls

### 16. `range(1, 0)` returns `[1]` (differs from Python) — **OPEN**

**Location:** `src/range.ts`, `RangeIterator`

Documented in JSDoc, but easy to miss. Python 3 `range(1, 0)` is empty. Consider a breaking change or a `strictRange` alias if Python parity is a goal.

---

### 17. `flatten` / `flatMap` intentionally do not flatten strings — **OPEN (by design)**

**Location:** `FlattenIterator`, `FlatMapIterator`

Matches Lodash-style behavior (strings are atomic). Document prominently — users expecting character-level flattening will be surprised.

---

### 18. `groupBy` uses reference equality (`!==`) for keys — **OPEN (by design)**

**Location:** `src/internal/GroupByIterator.ts`

Object-valued keys only group when the key function returns the same reference. `NaN` keys also never compare equal. Matches Python's `itertools.groupby` semantics but differs from `unique` (which uses `Set`).

---

### 19. `FunctionIterator` is single-use after sentinel — **OPEN (by design)**

**Location:** `src/internal/FunctionIterator.ts`

After the sentinel is returned, `func` is replaced with `() => sentinel`. The iterator cannot be restarted without constructing a new instance.

---

### 20. `isIterator` is permissive — **OPEN**

**Location:** `src/isIterator.ts`

Any object with a `next` function qualifies. This can mis-detect plain objects and affects `FlattenIterator` / `flatMap` dispatch order (iterator check before iterable).

---

### 21. `unzip` return types do not match runtime shape — **FIXED**

**Location:** `src/unzip.ts`, `src/internal/unzipTypes.ts`, `ExtendedIterator.unzip()`

**Fix:** Added `UnzipResult<Row>` and `UnzipExtendedResult<Row>` type helpers that map a row tuple (e.g. `[string, number]`) to per-column iterators (`[IterableIterator<string>, IterableIterator<number>]`). Removed `@ts-expect-error` and TODO from tests. Use a typed row (e.g. `as [string, number][]`) when literals would widen to `(string | number)[]`.

**Tests:** `src/unzip.test.ts`, `ExtendedIterator.test.ts`

---

## Packaging and tooling

### 22. Conflicting `types` entry points in `package.json` — **FIXED**

Top-level `types` now aligns with exports: `"./dist/types/index.d.ts"`.

---

### 23. `format` script does not cover `src/` — **FIXED**

Now: `"format": "prettier --write \"src/**/*.ts\""`.

---

### 24. README typo — **FIXED**

“Inpired by” → “Inspired by”.

---

## Testing gaps

| Scenario | Status |
|----------|--------|
| `cycle([])` / `cycle([], Infinity)` | **Covered** — `src/cycle.test.ts` |
| `tee` / `unzip` with `undefined` values | **Covered** — `src/tee.test.ts` |
| `chunks(0)`, `windows(0, …)` | **Covered** — `src/chunks.test.ts`, `src/windows.test.ts` |
| `reduce([])` without initial value | **Covered** — throws; `src/reduce.test.ts` |
| `min([])` / `max([])` / `minmax([])` | **Covered** — throws; respective test files |
| `unique({ justSeen: true })` with `0`, `''`, `false` | **Covered** — `src/unique.test.ts` |
| `permutations(singleIterable)` one-arg form | **Covered** — `src/permutations.test.ts` |
| `shuffle` seed boundary (`1`, `<0`, `>1`) | **Covered** — asserts no `undefined`; `src/shuffle.test.ts` |
| `SeekableIterator` with `maxLength` + backward seek after eviction | **Partial coverage** — still open (#14) |

---

## Existing TODOs in code (informational)

| File | Note |
|------|------|
| `src/arrayLike.ts` | Overload for passing an existing `seekable` + `maxLength` |
| `src/product.ts` | Currying support |
| `src/internal/ObjectIterator.ts` | BFS traversal order |
| `src/internal/CachedIterator.ts` | Deprecated in favor of `SeekableIterator` |

---

## Suggested fix priority (remaining)

1. **Medium term:** Fix `SeekableIterator` `maxLength` eviction / read-index drift (#14); add backward-seek regression tests.
2. **Low priority:** Clean up terminal `undefined` push in `CycleIterator` (#10).
3. **Product decisions:** Python `range` parity (#16), stricter `isIterator` (#20).
4. **Documentation:** Prominent notes on eager materialization (#12), `tee` memory (#13), string flattening (#17).

---

## What is working well

- **Lazy iterator composition** is consistent and well-factored through small internal iterator classes.
- **Tree-shakeable** subpath exports and `sideEffects: false` are set up correctly.
- **No runtime dependencies** — low maintenance surface.
- **TypeScript strict mode** enabled; explicit return types enforced by ESLint in production code.
- **Benchmark and comparison** infrastructure exists for iterare, rxjs, ixjs.
- **Documentation** (Typedoc + README examples) is thorough, including honest notes on `tee` memory and `reverse` materialization.

---

*Original review: manual code review and targeted runtime reproductions (2026-05-30). Status updated after fixes through 2026-05-31.*
