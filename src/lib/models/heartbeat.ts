export class HeartbeatTimeseries {
  public heartbeat: Heartbeat[] = [];
  public entries: { [timeSeriesKey: string]: boolean } = {};

  public add(hb: Heartbeat): void {
    const key = `${hb.DeviceID}-${hb.BeatCount}-${hb.BeatTime}`;
    if ( !this.entries[key] ) {
      this.entries[key] = true;
      this.heartbeat = [...this.heartbeat, hb];
    }
  }

  public clear(): void {
    this.heartbeat = [];
    this.entries = {};
  }
}

export interface Heartbeat {
  DeviceID: number;
  Timestamp: number;
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
