import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as uuid from 'uuid/v4';
import * as Joi from 'joi';
import { RecordDB, ProfileDB, DeviceDB } from '../../../lib';
import { CreateRecord, CreateRecordValidator, CreateRecordError, Record, Profile, Device } from '../../../public';

export class CreateRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();
  private profileDB = new ProfileDB();
  private deviceDB = new DeviceDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: CreateRecord.Request): Promise<HTTP.Response<CreateRecord.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, CreateRecordValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const profile = await this.profileDB.getProfile(event.body.profileUuid);
      if (!profile || profile.owner !== owner) {
        return this.resp.forbidden({ error: CreateRecordError.profileError });
      }
      const device = await this.deviceDB.getDevice(event.body.deviceUuid);
      if (!device || device.owner !== owner) {
        return this.resp.forbidden({ error: CreateRecordError.deviceError });
      }

      const recordUuid = uuid();
      const name = event.body.name || ``;
      const record = await this.db.createRecord(recordUuid, profile.profileUuid, device.deviceUuid, owner, name, Date.now(), undefined, event.body.description);

      return this.resp.ok({ status: 'success', record });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: CreateRecordError.generalError });
    }
  }
}
