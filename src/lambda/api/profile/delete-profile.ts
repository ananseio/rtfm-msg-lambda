import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { ProfileDB } from '../../../lib';
import { DeleteProfile, DeleteProfileValidator, DeleteProfileError, Profile } from '../../../public';

export class DeleteProfileHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new ProfileDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: DeleteProfile.Request): Promise<HTTP.Response<DeleteProfile.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, DeleteProfileValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const profileUuid = event.parameters.profileUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const profile = await this.db.getProfile(profileUuid);

      if (!profile) {
        return this.resp.notFound({ error: DeleteProfileError.noProfile + profileUuid });
      } else if (profile.owner !== owner) {
        return this.resp.unauthorized({ error: DeleteProfileError.notOwner + profileUuid });
      }

      await this.db.deleteProfile(profileUuid);
      return this.resp.ok({ status: 'success' });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: DeleteProfileError.generalError });
    }
  }
}
