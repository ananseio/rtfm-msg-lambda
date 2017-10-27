import { DynamoDB } from 'aws-sdk';
import { Record, DataPoint } from '../public';

export class RecordDB {
  private db = new DynamoDB.DocumentClient();
  private tableName = `rtfm-records-${process.env.STAGE}`;

  public async createRecord (recordUuid: string, profileUuid: string, deviceUuid:string, owner: string, name: string, startTime: number, endTime?: number, description?: string, dataPoints?: DataPoint[]): Promise<Record> {
    const response = await this.db.put({
      TableName: this.tableName,
      Item: { recordUuid, profileUuid, deviceUuid, owner, name, description, startTime, endTime, dataPoints },
      Expected: {
        recordUuid: { Exists: false },
      },
    }).promise();
    return response.Attributes as Record;
  }

  public async getRecord (recordUuid: string): Promise<Record | undefined> {
    const record = await this.db.get({
      TableName: this.tableName,
      Key: { recordUuid },
    }).promise();
    return record.Item as Record;
  }

  public async listRecord (owner: string, profileUuid?: string, startTime?: number, endTime?: number): Promise<Record[]> {
    let filters: string[] = [];
    if (profileUuid) filters.push(`profileUuid = :profileUuid`);
    if (startTime) filters.push(`startTime >= :startTime`);
    if (endTime) filters.push(`endTime >= :endTime`);

    const response = await this.db.query({
      TableName: this.tableName,
      KeyConditionExpression: `owner = :owner`,
      FilterExpression: filters.join(', '),
      ExpressionAttributeValues: {
        ':owner': owner,
        ':profileUuid': profileUuid,
        ':startTime': startTime,
        ':endTime': endTime
      },
    }).promise();
    return (response.Items as Record[]) || [];
  }

  public async updateRecord (recordUuid: string, record: { name?: string; description?: string; endTime?: number; dataPoints: DataPoint[]; }): Promise<Record> {
    const exprs = [], names: any = {}, values: any = {};
    for (const field of Object.keys(record)) {
      exprs.push(`#${field} = :${field}`);
      names[`#${field}`] = field;
      values[`:${field}`] = (record as any)[field];
    }

    const response = await this.db.update({
      TableName: this.tableName,
      Key: { recordUuid },
      Expected: {
        recordUuid: { Exists: true },
      },
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
