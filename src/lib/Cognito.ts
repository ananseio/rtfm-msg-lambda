import { CognitoIdentity, CognitoIdentityServiceProvider } from 'aws-sdk';
import { Settings } from '../settings';
// library lack @types
const passwordGenerator = require('generate-password');

export class Congito {
  private cognitoIdentity = new CognitoIdentity();
  private cognitoIdentityProvider = new CognitoIdentityServiceProvider();

  // public async getIdenetity (identityId: string): Promise<any>{
  //   const response =  await this.cognitoIdentity.describeIdentity({ IdentityId: identityId }).promise();
  //   return response.Logins;
  // }

  public async createUserGroup (groupName: string): Promise<boolean> {
    return !! await this.cognitoIdentityProvider.createGroup({
      UserPoolId: Settings.rtfmCognitoUserPool,
      GroupName: groupName,
    }).promise();
  }

  /*
   * deleteUserGroup is not yet support. Termination of services does not support currently.
   */

  /*
   * username must be unique among the whole user pool. In format of <SCHOOL_CODE>-<USERNAME>, e.g. dbs-csm
   * Return an one-time-password: 10-digit, lowercase, uppercase mixed. Need to be change after login.
   */
  public async createUser (username: string, email: string): Promise<string> {
    const oneTimePassword = passwordGenerator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      strict: true,
    });
    const response = await this.cognitoIdentityProvider.adminCreateUser({
      UserPoolId: Settings.rtfmCognitoUserPool,
      Username: username,
      TemporaryPassword: oneTimePassword,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [{
        Name: 'email',
        Value: email,
      }, {
        Name: 'email_verified',
        Value: 'True'
      }],
    }).promise();
    return oneTimePassword;
  }

  public async getGroupsOfUser (username: string): Promise<CognitoIdentityServiceProvider.GroupType[]>{
    const response = await this.cognitoIdentityProvider.adminListGroupsForUser({
      UserPoolId: Settings.rtfmCognitoUserPool,
      Username: username,
    }).promise();
    return response.Groups || [];
  }

  /**
   *  username & groupName must exist and valid to perform the action.
   */
  public async adduserToGroup (username: string, groupName: string): Promise<boolean> {
    return !! await this.cognitoIdentityProvider.adminAddUserToGroup({
      UserPoolId: Settings.rtfmCognitoUserPool,
      GroupName: groupName,
      Username: username,
    }).promise();
  }

  public async deleteUser (username: string): Promise<boolean> {
    return !! await this.cognitoIdentityProvider.adminDeleteUser({
      UserPoolId: Settings.rtfmCognitoUserPool,
      Username: username,
    }).promise();
  }
}
