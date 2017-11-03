import { Iot } from 'aws-sdk';
import { Settings } from '../settings';


export class IoT {
  private iot = new Iot();


  /**
   * [attach a policy to a cognito federated user token]
   * @param {string} userToken  [federated user token, e.g.: us-west-2:XXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX]
   * @param {string} policyName [the client policy]
   */
  public async attachPolicy (identityId: string, policyName = 'masterPolicy'): Promise<boolean> {
    return !! await this.iot.attachPrincipalPolicy({ policyName, principal: identityId }).promise();
  }

  /**
   * [createPolicy description]
   * @param  {string}          policyName [description]
   * @param  {object}          policy
   * @return {Promise<string>}            [the created policy arn]
   */
  public async createPolicy (policyName: string, policy: object): Promise<string> {
    const response = await this.iot.createPolicy({ policyName, policyDocument: JSON.stringify(policy) }).promise();
    return response.policyArn!;
  }

  public generateCusomterPolicy (customerName: string): object {
    return {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "iot:Connect"
          ],
          "Resource": `${Settings.rtfmIotArn}:*`
        },
        {
          "Effect": "Allow",
          "Action": [
            "iot:Subscribe"
          ],
          "Resource": `${Settings.rtfmIotArn}:topicfilter/rtfm/${customerName}`
        },
        {
          "Effect": "Allow",
          "Action": [
            "iot:Receive"
          ],
          "Resource": `${Settings.rtfmIotArn}:topic/rtfm/${customerName}`
        }
      ]
    };
  }
}
