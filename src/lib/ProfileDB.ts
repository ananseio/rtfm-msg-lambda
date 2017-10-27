import { DynamoDB } from 'aws-sdk';
import { Profile } from '../public';

export class ProfileDB {
  private db = new DynamoDB.DocumentClient();
  private tableName = `rtfm-profiles-${process.env.STAGE}`;

  public async createProfile (profileUuid: string, owner: string, name: string, description?: string, group?: string): Promise<Profile> {
    const response = await this.db.put({
      TableName: this.tableName,
      Item: { profileUuid, owner, name, description, group },
      Expected: {
        profileUuid: { Exists: false },
      },
    }).promise();
    return response.Attributes as Profile;
  }

  public async getProfile (profileUuid: string): Promise<Profile | undefined> {
    const profile = (await this.db.get({
      TableName: this.tableName,
      Key: { profileUuid }
    }).promise()).Item;
    return profile as Profile;
  }

  public async listProfile (owner: string): Promise<Profile[]> {
    const response = await this.db.query({
      TableName: this.tableName,
      KeyConditionExpression: `owner = :owner`,
      ExpressionAttributeValues: { ':owner': owner },
    }).promise()
    return (response.Items as Profile[]) || [];
  }

  public async updateProfile (profileUuid: string, profile: { name?: string; description?: string; groups?: string[]; }): Promise<Profile> {
    const exprs = [], names: any = {}, values: any = {};
    for (const field of Object.keys(profile)) {
      exprs.push(`#${field} = :${field}`);
      names[`#${field}`] = field;
      values[`:${field}`] = (profile as any)[field];
    }

    const response = await this.db.update({
      TableName: this.tableName,
      Key: { profileUuid },
      Expected: {
        profileUuid: { Exists: true },
      },
      UpdateExpression: `SET ${exprs.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }).promise();
    return response.Attributes as Profile;
  }

  public async deleteProfile (profileUuid: string): Promise<boolean> {
    return !! await this.db.delete({
      TableName: this.tableName,
      Key: { profileUuid },
    }).promise();
  }
}
