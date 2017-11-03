import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';

import { IoT, Congito } from '../../lib';
import { RequestAttachPolicy } from '../../public';

export class RequestAttachPolicyHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private iot = new IoT();
  //private cognito = new Congito();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: RequestAttachPolicy.Request): Promise<HTTP.Response<RequestAttachPolicy.Response>> {
    try {
      this.log.debug(event);

      const cognitoUserGroup = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      if (!cognitoUserGroup) {
        return this.resp.forbidden({ error: 'invalid user'});
      }

      const identityId = event.parameters.identityId;
      await this.iot.attachPolicy(identityId, `rtfm-policy-${cognitoUserGroup}`);

      return this.resp.ok({ status: 'success' });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: 'fail to attach policy' });
    }
  }
}
