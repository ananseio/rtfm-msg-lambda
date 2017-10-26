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
    deviceId: string,
    timestamp: number,
    nodeId: string,
    heartbeats: Heartbeat[],
  ): Promise<boolean> {
    return !!await utils.checkCondition(this.db.put({
      TableName: Settings.rtfmTimeSeriesTable,
      Item: {
        deviceId,
        timestamp_nodeId: `${timestamp}.${nodeId}`,
        nodeId,
        heartbeats,
      },
      ConditionExpression: 'attribute_not_exists(deviceId)',
    }).promise());
  }

  public async getHeartbeat(deviceId: string, since: string, until: string): Promise<Heartbeat[]> {
    const resp = await this.db.query({
      TableName: Settings.rtfmTimeSeriesTable,
      Select: 'ALL_ATTRIBUTES',
      KeyConditionExpression: '#D = :deviceId AND #T BETWEEN :since AND :until',
      ExpressionAttributeNames: {
        '#D': 'deviceId',
        '#T': 'timestamp_nodeId',
      },
      ExpressionAttributeValues: {
        ':deviceId': deviceId,
        ':since': since,
        ':until': until,
      },
    }).promise();

    return (resp.Items! as any[]).reduce(
      (accum, entries): Heartbeat[] => ([
        ...accum,
        ...entries.data,
      ]),
      [],
    );
  }
}
