/* eslint-disable no-console */

import { Suite } from 'benchmark';

export function handleStartEvent(event: { target: any; currentTarget: { name: string } }) {
  console.log(`Starting benchmark suite: ${event.currentTarget.name}`);
}

export function handleCycleEvent(event: { target: any }) {
  const result = event.target.toString();
  const splitIndex = result.indexOf('ops/sec') + 7;
  const rmeOpsPerSec = (event.target.stats.rme.toFixed(2) * (event.target.hz / 100))
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  console.log(
    '\t' + result.substring(0, splitIndex) + `, \xb1${rmeOpsPerSec} ops/sec or` + result.substring(splitIndex),
  );
}

export function handleCompleteEvent(event: any) {
  console.log('Fastest is ' + event.currentTarget.filter('fastest').map('name'));
}

export function setupSuite(...args: ConstructorParameters<typeof Suite>): Suite;
export function setupSuite(name: string): Suite;
export function setupSuite(...args: [string] | ConstructorParameters<typeof Suite>): Suite {
  return new Suite(...(args as any))
    .on('start', handleStartEvent)
    .on('cycle', handleCycleEvent)
    .on('complete', handleCompleteEvent);
}
