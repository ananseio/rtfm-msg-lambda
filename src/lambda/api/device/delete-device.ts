import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { DeviceDB } from '../../../lib';
import { DeleteDevice, DeleteDeviceValidator, DeleteDeviceError, Device } from '../../../public';

export class DeleteDeviceHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DeviceDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: DeleteDevice.Request): Promise<HTTP.Response<DeleteDevice.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, DeleteDeviceValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const deviceUuid = event.parameters.deviceUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const device = await this.db.getDevice(deviceUuid);

      if (!device) {
        return this.resp.notFound({ error: DeleteDeviceError.noDevice + deviceUuid });
      } else if (device.owner !== owner) {
        return this.resp.unauthorized({ error: DeleteDeviceError.notOwner + deviceUuid });
      }

      await this.db.deleteDevice(deviceUuid);
      return this.resp.ok({ status: 'success' });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: DeleteDeviceError.generalError });
    }
  }
}
