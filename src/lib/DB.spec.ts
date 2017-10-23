import { DynamoDB } from 'aws-sdk';

import { DB } from './DB';
import { Heartbeat } from './models/heartbeat';

import { Settings } from '../settings';

const deviceId: string = '34863';
const nodeId: string = 'unit-test';
const timestamp: number = Date.now();
const heartbeats: Heartbeat[] = [{
  DeviceID: 34863,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751734307,
}, {
  DeviceID: 34863,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751734355,
}];

const heartbeats2: Heartbeat[] = [{
  DeviceID: 34863,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751735123,
}, {
  DeviceID: 34863,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751735551,
}];

describe('database', () => {
  let db: DB;
  beforeAll(() => {
    db = new DB();
  });

  it('should create new heartbeat', async () => {
    expect(await db.putHeartbeat(deviceId, timestamp, nodeId, heartbeats)).toBe(true);
  });

  it('should not overwrite new heartbeat', async () => {
    expect(await db.putHeartbeat(deviceId, timestamp, nodeId, heartbeats)).toBe(false);
  });

  it('should get existing heartbeat', async () => {
    await db.putHeartbeat(deviceId, timestamp + 1000, nodeId, heartbeats2);
    const resultHeartbeats = await db.getHeartbeat(
      deviceId,
      `${timestamp}`,
      `${timestamp + 1001}`,
    );
    expect(resultHeartbeats).toEqual([...heartbeats, ...heartbeats2]);
  });
});
