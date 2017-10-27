import { DynamoDB } from 'aws-sdk';
import { Device } from '../public';

export class DeviceDB {
  private db = new DynamoDB.DocumentClient();
  private tableName = `rtfm-devices-${process.env.STAGE}`;

  public async createDevice (deviceUuid: string, deviceId: string, serial:string, owner: string, name: string, description?: string): Promise<Device> {
    const response = await this.db.put({
      TableName: this.tableName,
      Item: { deviceUuid, deviceId, serial, owner, name, description },
      Expected: {
        deviceUuid: { Exists: false },
      },
    }).promise();
    return response.Attributes as Device;
  }

  public async getDevice (deviceUuid: string): Promise<Device | undefined> {
    const device = (await this.db.get({
      TableName: this.tableName,
      Key: { deviceUuid }
    }).promise()).Item;
    return device as Device;
  }

  public async listDevice (owner: string): Promise<Device[]> {
    const response = await this.db.query({
      TableName: this.tableName,
      KeyConditionExpression: `owner = :owner`,
      ExpressionAttributeValues: { ':owner': owner },
    }).promise()
    return (response.Items as Device[]) || [];
  }

  public async updateDevice (deviceUuid: string, device: { name?: string; description?: string; }): Promise<Device> {
    const exprs = [], names: any = {}, values: any = {};
    for (const field of Object.keys(device)) {
      exprs.push(`#${field} = :${field}`);
      names[`#${field}`] = field;
      values[`:${field}`] = (device as any)[field];
    }

    const response = await this.db.update({
      TableName: this.tableName,
      Key: { deviceUuid },
      Expected: {
        deviceUuid: { Exists: true },
      },
      UpdateExpression: `SET ${exprs.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }).promise();
    return response.Attributes as Device;
  }

  public async deleteDevice (deviceUuid: string): Promise<boolean> {
    return !! await this.db.delete({
      TableName: this.tableName,
      Key: { deviceUuid },
    }).promise();
  }
}
