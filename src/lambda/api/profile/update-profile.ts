import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { ProfileDB } from '../../../lib';
import { UpdateProfile, UpdateProfileValidator, UpdateProfileError, Profile } from '../../../public';

export class UpdateProfileHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new ProfileDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: UpdateProfile.Request): Promise<HTTP.Response<UpdateProfile.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, UpdateProfileValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const profileUuid = event.parameters.profileUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const profile = await this.db.getProfile(profileUuid);

      if (!profile) {
        return this.resp.notFound({ error: UpdateProfileError.noProfile + profileUuid });
      } else if (profile.owner !== owner) {
        return this.resp.unauthorized({ error: UpdateProfileError.notOwner + profileUuid });
      }

      const param: any = {};
      if (event.body.name !== undefined) param.name = event.body.name;
      if (event.body.description !== undefined) param.description = event.body.description;
      if (event.body.groups !== undefined) param.groups = event.body.groups;
      const newProfile = await this.db.updateProfile(profile.profileUuid, param);

      return this.resp.ok({ status: 'success', profile: newProfile });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: UpdateProfileError.generalError });
    }
  }
}
