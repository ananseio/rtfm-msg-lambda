import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { RecordDB } from '../../../lib';
import { DeleteRecord, DeleteRecordValidator, DeleteRecordError, Record } from '../../../public';

export class DeleteRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: DeleteRecord.Request): Promise<HTTP.Response<DeleteRecord.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, DeleteRecordValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const recordUuid = event.parameters.recordUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const record = await this.db.getRecord(recordUuid);

      if (!record) {
        return this.resp.notFound({ error: DeleteRecordError.noRecord + recordUuid });
      } else if (record.owner !== owner) {
        return this.resp.unauthorized({ error: DeleteRecordError.notOwner + recordUuid });
      }

      await this.db.deleteRecord(recordUuid);
      return this.resp.ok({ status: 'success' });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: DeleteRecordError.generalError });
    }
  }
}
