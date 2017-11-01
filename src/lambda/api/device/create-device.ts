import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as uuid from 'uuid/v4';
import * as Joi from 'joi';
import { DeviceDB } from '../../../lib';
import { CreateDevice, CreateDeviceValidator, CreateDeviceError, Device } from '../../../public';

export class CreateDeviceHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DeviceDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: CreateDevice.Request): Promise<HTTP.Response<CreateDevice.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, CreateDeviceValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const deviceUuid = uuid();
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const name = event.body.name || event.body.deviceId;
      await this.db.createDevice(deviceUuid, event.body.deviceId, event.body.serial, owner, name, event.body.description);

      return this.resp.ok({ status: 'success', deviceUuid });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: CreateDeviceError.generalError });
    }
  }
}
