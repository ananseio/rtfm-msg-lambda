import { Heartbeat, HeartbeatTimeseries, HeartbeatDeviceTS } from './models/heartbeat';

export function flattenSnsMessage(
  heartbeatDeviceTimeSeries: HeartbeatDeviceTS
): Heartbeat[] {
  const hbts = new HeartbeatTimeseries();

  Object.keys(heartbeatDeviceTimeSeries)
    .forEach((deviceId) => heartbeatDeviceTimeSeries[deviceId]
      .forEach(hb => hbts.add(hb)));

  return hbts.heartbeat;
}
