import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { RecordDB } from '../../../lib';
import { ListRecord, ListRecordValidator, ListRecordError, Record } from '../../../public';

export class ListRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: ListRecord.Request): Promise<HTTP.Response<ListRecord.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, ListRecordValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const records = await this.db.listRecord(owner, event.query.profileUuid, parseInt(event.query.startTime) || undefined, parseInt(event.query.endTime) || undefined);

      return this.resp.ok({ status: 'success', records });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: ListRecordError.generalError });
    }
  }
}
