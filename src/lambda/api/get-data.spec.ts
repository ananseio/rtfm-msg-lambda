import * as zlib from 'zlib';

import { Logger } from '@ananseio/serverless-common';
import { test } from '@ananseio/serverless-common/test';
import { DB } from '../../lib/DB';
import { GetData } from '../../public';

import { Heartbeat } from '../../lib/models/heartbeat';

import { SNSDataQueryHandler } from './get-data';

describe('GET /data', () => {
  const nodeId: string = 'unit-test-get-data';
  const deviceId: string = '34862';
  const timestamp: number = Date.now();

  const heartbeats: Heartbeat[] = [{
    DeviceID: 34862,
    BeatTime: 31348,
    BeatCount: 161,
    ComputedHeartRate: 83,
    PreviousBeat: 30608,
    Timestamp: 1503751734307,
  }, {
    DeviceID: 34862,
    BeatTime: 31348,
    BeatCount: 161,
    ComputedHeartRate: 83,
    PreviousBeat: 30608,
    Timestamp: 1503751734355,
  }];

  const heartbeats2: Heartbeat[] = [{
    DeviceID: 34862,
    BeatTime: 31348,
    BeatCount: 161,
    ComputedHeartRate: 83,
    PreviousBeat: 30608,
    Timestamp: 1503751735123,
  }, {
    DeviceID: 34862,
    BeatTime: 31348,
    BeatCount: 161,
    ComputedHeartRate: 83,
    PreviousBeat: 30608,
    Timestamp: 1503751735551,
  }];

  const getHeartbeats = test(SNSDataQueryHandler, 'handler', GetData);
  getHeartbeats.fields.log = jasmine.createSpyObj(Logger.prototype);

  beforeAll(async () => {
    const db = new DB();
    await Promise.all([
      db.putHeartbeat(deviceId, timestamp, nodeId, heartbeats),
      db.putHeartbeat(deviceId, timestamp + 1000, nodeId, heartbeats2),
    ]);
  });

  it('should return all heartbeats in gzip', async () => {
    const resp = await getHeartbeats({
      query: {
        deviceId,
      },
    });

    const rawResponse = { ...resp };
    const gunzipBody = zlib.gunzipSync(rawResponse.body as Buffer).toString();

    expect(JSON.parse(gunzipBody).result).toEqual([...heartbeats, ...heartbeats2]);
  });

});
