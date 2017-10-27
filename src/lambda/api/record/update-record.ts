import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { RecordDB } from '../../../lib';
import { UpdateRecord, UpdateRecordValidator, UpdateRecordError, Record } from '../../../public';

export class UpdateRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: UpdateRecord.Request): Promise<HTTP.Response<UpdateRecord.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, UpdateRecordValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const recordUuid = event.parameters.recordUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const record = await this.db.getRecord(recordUuid);

      if (!record) {
        return this.resp.notFound({ error: UpdateRecordError.noRecord + recordUuid });
      } else if (record.owner !== owner) {
        return this.resp.unauthorized({ error: UpdateRecordError.notOwner + recordUuid });
      }

      const param: any = {};
      if (event.body.name !== undefined) param.name = event.body.name;
      if (event.body.description !== undefined) param.description = event.body.description;
      const newRecord = await this.db.updateRecord(record.deviceUuid, param);

      return this.resp.ok({ status: 'success', record: newRecord });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: UpdateRecordError.generalError });
    }
  }
}
