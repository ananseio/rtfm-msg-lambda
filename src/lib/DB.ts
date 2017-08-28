import { utils } from '@ananseio/serverless-common';
import { DynamoDB } from 'aws-sdk';
import { Heartbeat } from './models/heartbeat';
import { Settings } from '../settings';

/**
 * database
 */
export class DB {
  private db = new DynamoDB.DocumentClient();

  public async putHeartbeat(
    nodeId: string,
    timestamp: number,
    heartbeats: Heartbeat[]
  ): Promise<boolean> {
    return !!await utils.checkCondition(this.db.put({
      TableName: Settings.rtfmTimeSeriesTable,
      Item: { nodeId, timestamp, heartbeats },
      ConditionExpression: 'attribute_not_exists(nodeId)'
    }).promise());
  }

  public async getHeartbeat(nodeId: string, timestamp: number): Promise<Heartbeat[]> {
    return (await this.db.get({
      TableName: Settings.rtfmTimeSeriesTable,
      Key: { nodeId, timestamp }
    }).promise()).Item!.heartbeats as Heartbeat[];
  }
}
