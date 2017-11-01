import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { DeviceDB } from '../../../lib';
import { UpdateDevice, UpdateDeviceValidator, UpdateDeviceError, Device } from '../../../public';

export class UpdateDeviceHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DeviceDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: UpdateDevice.Request): Promise<HTTP.Response<UpdateDevice.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, UpdateDeviceValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const deviceUuid = event.parameters.deviceUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const device = await this.db.getDevice(deviceUuid);

      if (!device) {
        return this.resp.notFound({ error: UpdateDeviceError.noDevice + deviceUuid });
      } else if (device.owner !== owner) {
        return this.resp.unauthorized({ error: UpdateDeviceError.notOwner + deviceUuid });
      }

      const param: any = {};
      if (event.body.name !== undefined) param.name = event.body.name;
      if (event.body.description !== undefined) param.description = event.body.description;
      const newDevice = await this.db.updateDevice(device.deviceUuid, param);

      return this.resp.ok({ status: 'success', device: newDevice });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: UpdateDeviceError.generalError });
    }
  }
}
