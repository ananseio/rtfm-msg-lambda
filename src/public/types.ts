export const Service = 'rtfm';

/**
 * Customer is the client who paid money to join rtfm. It is usually a organization, e.g. school.
 * token is the secret key. Used to add nodes or profile.
 */
export type Customer = {
  name: string;
  shortCode: string;
  email: string;
  token: string;
  description?: string;
}

/**
 * Profile is a user only used to tag the device..
 */
export type Profile = {
  profileUuid: string;
  owner: string;
  name: string;
  description?: string;
  groups?: string[];
}

/**
 * deviceUuid is for rtfm to uniquely identify the device. deviceId is only what got from hardware according to manufacturer.
 */
export type Device = {
  deviceUuid: string;
  deviceId: string;
  serial: string;
  owner: string;
  name: string;
  description?: string;
}

/**
 * Record is a period of time of a profile with candidate
 */
export type Record = {
  recordUuid: string;
  profileUuid: string;
  deviceUuid: string;
  owner: string;
  name: string;
  startTime: number;
  endTime: number;
  description?: string;
  dataPoints: DataPoint[];
}

export type DataPoint = {
  timestamp: number;
  heartbeat: number;
  // adding extended properties, e.g. power, speed, energy, etc.
}
