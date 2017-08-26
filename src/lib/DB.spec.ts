import { DynamoDB } from 'aws-sdk';
import { DB } from './DB';
import { Settings } from '../settings';

const heartbeat = {
  DeviceID: 34862,
  BeatTime: 31348,
  BeatCount: 161,
  ComputedHeartRate: 83,
  PreviousBeat: 30608,
  Timestamp: 1503751734307
};

describe('database', () => {
  let db: DB;
  beforeAll(() => {
    db = new DB();
  });

  it('should create new heartbeat', async () => {
    expect(await db.putHeartbeat(
      String(heartbeat.DeviceID),
      heartbeat.Timestamp,
      heartbeat)
    ).toBe(true);
  });

  it('should not overwrite new heartbeat', async () => {
    expect(await db.putHeartbeat(
      String(heartbeat.DeviceID),
      heartbeat.Timestamp,
      heartbeat)
    ).toBe(false);
  });

  it('should get existing heartbeat', async () => {
    expect(await db.getHeartbeat(
      String(heartbeat.DeviceID),
      heartbeat.Timestamp)
    ).toEqual({...heartbeat, id: String(heartbeat.DeviceID), timestamp: heartbeat.Timestamp});
  });
});
