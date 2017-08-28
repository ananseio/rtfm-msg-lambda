import { utils } from '@ananseio/serverless-common';
import { DynamoDB } from 'aws-sdk';
import { Heartbeat } from './models/heartbeat';
import { Settings } from '../settings';

/**
 * database
 */
export class DB {
  private db = new DynamoDB.DocumentClient();

  public async putHeartbeat(heartbeat: Heartbeat): Promise<boolean> {
    return !!await utils.checkCondition(this.db.put({
      TableName: Settings.rtfmTimeSeriesTable,
      Item: heartbeat,
      ConditionExpression: 'attribute_not_exists(DeviceID)'
    }).promise());
  }

  public async getHeartbeat(DeviceID: string, Timestamp: number): Promise<Heartbeat> {
    return (await this.db.get({
      TableName: Settings.rtfmTimeSeriesTable,
      Key: { DeviceID, Timestamp }
    }).promise()).Item! as Heartbeat;
  }
}
