import { utils } from '@ananseio/serverless-common';
import { DynamoDB } from 'aws-sdk';
import { Heartbeat } from './models/heartbeat';
import { Settings } from '../settings';

/**
 * database
 */
export class DB {
  private db = new DynamoDB.DocumentClient();

  public async putHeartbeat(id: string, timestamp: number, heartbeat: Heartbeat): Promise<boolean> {
    return !!await utils.checkCondition(this.db.put({
      TableName: Settings.rtfmTimeSeriesTable,
      Item: { id, timestamp, heartbeat },
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise());
  }

  public async getMessage(id: string): Promise<string> {
    return (await this.db.get({
      TableName: Settings.rtfmTimeSeriesTable,
      Key: { id }
    }).promise()).Item!.message as string;
  }
}
