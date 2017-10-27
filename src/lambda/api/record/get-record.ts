import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { RecordDB } from '../../../lib';
import { GetRecord, GetRecordValidator, GetRecordError, Record } from '../../../public';

export class GetRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: GetRecord.Request): Promise<HTTP.Response<GetRecord.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, GetRecordValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const recordUuid = event.parameters.recordUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const record = await this.db.getRecord(recordUuid);

      if (!record) {
        return this.resp.notFound({ error: GetRecordError.noRecord + recordUuid });
      } else if (record.owner !== owner) {
        return this.resp.unauthorized({ error: GetRecordError.notOwner + recordUuid });
      }

      return this.resp.ok({ status: 'success', record });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: GetRecordError.generalError });
    }
  }
}
