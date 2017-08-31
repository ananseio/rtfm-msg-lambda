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

  public async getHeartbeat(nodeId: string, since: number, until: number): Promise<Heartbeat[]> {
    const resp = await this.db.query({
      TableName: Settings.rtfmTimeSeriesTable,
      Select: "ALL_ATTRIBUTES",
      KeyConditionExpression: '#N = :nodeId AND #T BETWEEN :since AND :until',
      ExpressionAttributeNames: {
        '#N': 'nodeId',
        '#T': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':nodeId': nodeId,
        ':since': since,
        ':until': until
      }
    }).promise();

    const heartbeats: Heartbeat[] = (resp.Items! as any[]).reduce((
      accum,
      entries
    ): Heartbeat[] => [...accum, ...entries.heartbeats], [])

    return heartbeats;
  }
}
