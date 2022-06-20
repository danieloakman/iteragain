const a = {
  source: (function* () {
    yield 1;
    yield 2;
    yield 3;
  })(),
  next() {
    return this.source.next();
  },
};
console.log(a.next());
