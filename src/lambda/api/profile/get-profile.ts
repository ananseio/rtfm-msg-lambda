import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { ProfileDB } from '../../../lib';
import { GetProfile, GetProfileValidator, GetProfileError, Profile } from '../../../public';

export class GetProfileHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new ProfileDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: GetProfile.Request): Promise<HTTP.Response<GetProfile.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, GetProfileValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const profileUuid = event.parameters.profileUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const profile = await this.db.getProfile(profileUuid);

      if (!profile) {
        return this.resp.notFound({ error: GetProfileError.noProfile + profileUuid });
      } else if (profile.owner !== owner) {
        return this.resp.unauthorized({ error: GetProfileError.notOwner + profileUuid });
      }

      return this.resp.ok({ status: 'success', profile });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: GetProfileError.generalError });
    }
  }
}
