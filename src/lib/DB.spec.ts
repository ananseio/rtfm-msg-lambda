import { DynamoDB } from 'aws-sdk';
import { DB } from './DB';
import { Settings } from '../settings';
import { Heartbeat } from './models/heartbeat';

const nodeId:string = 'unit-test';
const timestamp:number = Date.now();
const heartbeats:Heartbeat[] = [{
  DeviceID: 34862,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751734307
}, {
  DeviceID: 34862,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751734355
}];

const heartbeats2:Heartbeat[] = [{
  DeviceID: 34862,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751735123
}, {
  DeviceID: 34862,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751735551
}];

describe('database', () => {
  let db: DB;
  beforeAll(() => {
    db = new DB();
  });

  it('should create new heartbeat', async () => {
    expect(await db.putHeartbeat(nodeId, timestamp, heartbeats)).toBe(true);
  });

  it('should not overwrite new heartbeat', async () => {
    expect(await db.putHeartbeat(nodeId, timestamp, heartbeats)).toBe(false);
  });

  it('should get existing heartbeat', async () => {
    await db.putHeartbeat(nodeId, timestamp+1000, heartbeats2);

    expect(await db.getHeartbeat(
      nodeId,
      timestamp,
      timestamp+1000
    )).toEqual([...heartbeats, ...heartbeats2]);
  });
});
