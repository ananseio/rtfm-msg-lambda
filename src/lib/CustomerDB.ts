import { DynamoDB } from 'aws-sdk';
import { Customer } from '../public';

export class CustomerDB {
  private db = new DynamoDB.DocumentClient();
  private tableName = `rtfm-customers-${process.env.STAGE}`;

  public async createCustomer (name: string, shortCode: string, email: string, token: string, description?: string): Promise<void> {
    const response = await this.db.put({
      TableName: this.tableName,
      Item: { name, shortCode, email, token, description },
      ConditionExpression: `attribute_not_exists(#name)`,
      ExpressionAttributeNames: { '#name': 'name' },
    }).promise();
    return;
  }

  public async getCustomer (name: string): Promise<Customer | undefined> {
    const response = await this.db.get({
      TableName: this.tableName,
      Key: { name },
    }).promise();
    return response.Item as Customer;
  }
}
