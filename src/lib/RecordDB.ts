import { DynamoDB } from 'aws-sdk';
import { DataPoint, Record } from '../public';

export class RecordDB {
  private db = new DynamoDB.DocumentClient();
  private tableName = `rtfm-records-${process.env.STAGE}`;

  public async createRecord (recordUuid: string, profileUuid: string, deviceUuid: string, owner: string, name: string, startTime: number, endTime?: number, description?: string, dataPoints?: DataPoint[]): Promise<void> {
    const response = await this.db.put({
      TableName: this.tableName,
      Item: { recordUuid, profileUuid, deviceUuid, owner, name, description, startTime, endTime, dataPoints },
      ConditionExpression: `attribute_not_exists(recordUuid)`,
    }).promise();
    return;
  }

  public async getRecord (recordUuid: string): Promise<Record | undefined> {
    const record = await this.db.get({
      TableName: this.tableName,
      Key: { recordUuid },
    }).promise();
    return record.Item as Record;
  }

  public async listRecord (owner: string, profileUuid?: string, startTime?: number, endTime?: number): Promise<Record[]> {
    let keyCodition = `#owner = :owner`;
    const filters: string[] = [];

    if (profileUuid) keyCodition += ` AND profileUuid = :profileUuid`;

    if (startTime) filters.push(`startTime >= :startTime`);
    if (endTime) {
      if ( endTime > 0) {
        // If there is endTime and endTime is greater than 0, we filter by endTime
        filters.push(`endTime <= :endTime`);
      } else if (endTime < 0) {
        // If endTime is less than 0, we filter out anything with endTime
        filters.push(`attribute_not_exists(endTime)`);
      }
    }

    const response = await this.db.query({
      TableName: this.tableName,
      IndexName: 'owner-index',
      KeyConditionExpression: keyCodition,
      FilterExpression: filters.join(' AND ') || undefined,
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: {
        ':owner': owner,
        ':profileUuid': profileUuid,
        ':startTime': startTime,
        ':endTime': endTime && endTime > 0 ? endTime : undefined,
      },
    }).promise();
    return (response.Items as Record[]) || [];
  }

  public async updateRecord (recordUuid: string, record: { name?: string; description?: string; endTime?: number; dataPoints?: DataPoint[]; }): Promise<Record> {
    const exprs = [], names: any = {}, values: any = {};
    for (const field of Object.keys(record)) {
      exprs.push(`#${field} = :${field}`);
      names[`#${field}`] = field;
      values[`:${field}`] = (record as any)[field];
    }

    const response = await this.db.update({
      TableName: this.tableName,
      Key: { recordUuid },
      ConditionExpression: `attribute_exists(recordUuid)`,
      UpdateExpression: `SET ${exprs.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }).promise();
    return response.Attributes as Record;
  }

  public async deleteRecord (recordUuid: string): Promise<boolean> {
    return !! await this.db.delete({
      TableName: this.tableName,
      Key: { recordUuid },
    }).promise();
  }
}
