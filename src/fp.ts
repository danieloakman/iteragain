export function pipe<A, B>(value: A, fn1: (value: A) => B): B;
export function pipe<A, B, C>(value: A, fn1: (value: A) => B, fn2: (value: B) => C): C;
export function pipe<A, B, C, D>(value: A, fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D): D;
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (value: A) => B,
  fn2: (value: B) => C,
  fn3: (value: C) => D,
  fn4: (value: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  value: A,
  fn1: (value: A) => B,
  fn2: (value: B) => C,
  fn3: (value: C) => D,
  fn4: (value: D) => E,
  fn5: (value: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  fn1: (value: A) => B,
  fn2: (value: B) => C,
  fn3: (value: C) => D,
  fn4: (value: D) => E,
  fn5: (value: E) => F,
  fn6: (value: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  fn1: (value: A) => B,
  fn2: (value: B) => C,
  fn3: (value: C) => D,
  fn4: (value: D) => E,
  fn5: (value: E) => F,
  fn6: (value: F) => G,
  fn7: (value: G) => H,
): H;
export function pipe<T>(value: T, ...fns: ((value: T) => T)[]): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// type ParametersExceptFirst<T> = T extends (first: any, ...rest: infer P) => any ? P : never;

// interface AllowCurry<T extends (...args: any[]) => any> {
//   (...args: Parameters<T>): ReturnType<T>;
//   (...args: ParametersExceptFirst<T>): (arg0: Parameters<T>[0]) => ReturnType<T>;
// }

// export function curryNIf<T extends (...args: any[]) => any>(fn: T, opt: Record<1 | 'all', (...args: Parameters<T>) => boolean>): AllowCurry<T> {
  
// }
