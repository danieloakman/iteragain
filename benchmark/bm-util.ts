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

export function setupSuite(...args: ConstructorParameters<typeof Suite>) {
  return new Suite(...args)
    .on('start', handleStartEvent)
    .on('cycle', handleCycleEvent)
    .on('complete', handleCompleteEvent);
}
