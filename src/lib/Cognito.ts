import { CognitoIdentity } from 'aws-sdk';

export class Congito {
  private congito = new CognitoIdentity();

  public async getIdenetity (identityId: string): Promise<any>{
    const response =  await this.congito.describeIdentity({ IdentityId: identityId }).promise();
    return response.Logins;
  }
}
