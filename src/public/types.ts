export const Service = 'rtfm';

/**
 * Customer is the client who paid money to join the rtfm. It is usually a organization, e.g. school.
 * token is the secret key. Used to add nodes or profile.
 */
export type Customer = {
  customerUuid: string;
  name: string;
  description: string;
  email: string;
  token: string;
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
 * Node is a hardware for communicate with rtfm. It must have a certificate to authenticate itself. e.g. raspberryPi.
 */
export type Node = {
  nodeUuid: string;
  owner: string;
  name: string;
  description: string;
  certificateId: string;
}

/**
 * Session is a group of records grouping together for comparison. For example, in a 100-meter running training,
 */
/* [SUSPEND] feature not support yet.
export type Session = {
  sessionUuid: string;
  owner: string;
  name: string;
  description: string;
  timestamp: string;
  records: Record[];
}
*/

/**
 * Record is
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
