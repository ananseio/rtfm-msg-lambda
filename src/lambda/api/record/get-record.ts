import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { RecordDB, DataDB, DeviceDB, isSameHeartBeat } from '../../../lib';
import { GetRecord, GetRecordValidator, GetRecordError, Record } from '../../../public';

export class GetRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();
  private dataDB = new DataDB();
  private deviceDB = new DeviceDB();

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

      const device = await this.deviceDB.getDevice(record.deviceUuid);
      const heartbeats = await this.dataDB.getHeartbeat(device!.deviceId, record.startTime, record.endTime);
      record.dataPoints = heartbeats.filter((heartbeat, index, array) => {
        return index === 0 || !isSameHeartBeat(heartbeat, array[index - 1]);
      }).map(heartbeat => ({ timestamp: heartbeat.Timestamp, heartbeat: heartbeat.ComputedHeartRate }));

      return this.resp.ok({ status: 'success', record });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: GetRecordError.generalError });
    }
  }
}
