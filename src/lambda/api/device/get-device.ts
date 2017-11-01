import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import * as Joi from 'joi';
import { DeviceDB } from '../../../lib';
import { GetDevice, GetDeviceValidator, GetDeviceError, Device } from '../../../public';

export class GetDeviceHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DeviceDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: GetDevice.Request): Promise<HTTP.Response<GetDevice.Response>> {
    try {
      this.log.debug(this.rawEvent);
      const isValid = Joi.validate(event, GetDeviceValidator, { allowUnknown: true, abortEarly: false });
      if (isValid.error) {
        return this.resp.badRequest({ error: isValid.error.message });
      }

      const deviceUuid = event.parameters.deviceUuid;
      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const device = await this.db.getDevice(deviceUuid);

      if (!device) {
        return this.resp.notFound({ error: GetDeviceError.noDevice + deviceUuid });
      } else if (device.owner !== owner) {
        return this.resp.unauthorized({ error: GetDeviceError.notOwner + deviceUuid });
      }

      return this.resp.ok({ status: 'success', device });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: GetDeviceError.generalError });
    }
  }
}
