// @ts-check
'use strict';

// const glob = require('glob');
// console.time('t');
// const r = glob.GlobSync('**/*.json');
// console.timeEnd('t');
// console.log();

// import isIterator from '../dist/isIterator';
const isIterator = require('../dist/isIterator');
console.log(isIterator.default([]));