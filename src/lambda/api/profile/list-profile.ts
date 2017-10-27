import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import { ProfileDB } from '../../../lib';
import { ListProfile, ListProfileError, Profile } from '../../../public';

export class CreateProfileHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new ProfileDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: ListProfile.Request): Promise<HTTP.Response<ListProfile.Response>> {
    try {
      this.log.debug(this.rawEvent);

      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const profiles = await this.db.listProfile(owner);

      return this.resp.ok({ status: 'success', profiles });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: ListProfileError.generalError });
    }
  }
}
