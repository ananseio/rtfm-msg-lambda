import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { RecordDB, DataDB, DeviceDB, isSameHeartBeat } from '../../../lib';
import { UpdateRecord, UpdateRecordValidator, UpdateRecordError, Record } from '../../../public';

export class UpdateRecordHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new RecordDB();
  private dataDB = new DataDB();
  private deviceDB = new DeviceDB();

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

      // if client request stop, retrieve all the data to form simple dataPoint array
      if (event.parameters.action === '_stop') {
        if (record.endTime) {
          return this.resp.badRequest({ error: UpdateRecordError.repeatStop });
        }

        param.endTime = Date.now();
        const device = await this.deviceDB.getDevice(record.deviceUuid);
        const heartbeats = await this.dataDB.getHeartbeat(device!.deviceId, record.startTime, param.endTime);
        param.dataPoints = heartbeats.filter((heartbeat, index, array) => {
          return index === 0 || !isSameHeartBeat(heartbeat, array[index - 1]);
        }).map(heartbeat => ({ timestamp: heartbeat.Timestamp, heartbeat: heartbeat.ComputedHeartRate }));
      }

      const newRecord = await this.db.updateRecord(record.recordUuid, param);

      return this.resp.ok({ status: 'success', record: newRecord });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: UpdateRecordError.generalError });
    }
  }
}
