export interface HeartbeatDeviceTS {
  [DeviceId: string]: Heartbeat[]
}

export class HeartbeatTimeseries {
  heartbeat: Heartbeat[] = [];
  entries: { [timeSeriesKey: string]: boolean } = {};

  add(hb: Heartbeat): void {
    const key = `${hb.DeviceID}-${hb.BeatCount}-${hb.BeatTime}`;
    if ( !this.entries[key] ) {
      this.entries[key] = true;
      this.heartbeat = [...this.heartbeat, hb];
    }
  }

  clear(): void {
    this.heartbeat = [];
    this.entries = {};
  }
}

export interface Heartbeat {
  Timestamp: number;
  DeviceID: number;
  BeatCount: number;
  ComputedHeartRate: number;
  BeatTime: number;
  PreviousBeat: number;
  HwVersion?: string;
  SwVersion?: string;
  ModelNum?: string;
  ManId?: string;
  SerialNumber?: string;
}
