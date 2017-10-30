import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as uuid from 'uuid/v4';
import * as Joi from 'joi';
import { ProfileDB } from '../../../lib';
import { CreateProfile, CreateProfileValidator, CreateProfileError, Profile } from '../../../public';

export class CreateProfileHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new ProfileDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: CreateProfile.Request): Promise<HTTP.Response<CreateProfile.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, CreateProfileValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const profileUuid = uuid();
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const name = event.body.name || 'new profile';
      await this.db.createProfile(profileUuid, owner, name, event.body.description, event.body.groups);

      return this.resp.ok({ status: 'success', profileUuid });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: CreateProfileError.generalError });
    }
  }
}
