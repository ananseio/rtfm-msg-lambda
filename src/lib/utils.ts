import { Heartbeat } from '../lib/models/heartbeat';

export function isSameHeartBeat (hb1: Heartbeat, hb2: Heartbeat): boolean {
  return (hb1.BeatTime === hb2.BeatTime && hb1.BeatCount === hb2.BeatCount && hb1.PreviousBeat === hb2.PreviousBeat);
}
