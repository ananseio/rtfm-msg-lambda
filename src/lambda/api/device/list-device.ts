import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import { DeviceDB } from '../../../lib';
import { ListDevice, ListDeviceError, Device } from '../../../public';

export class ListDeviceHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DeviceDB();

  @Handler
  @Log(HTTP)
  @HTTP({ cors: { credentials: true } })
  public async handler(event: ListDevice.Request): Promise<HTTP.Response<ListDevice.Response>> {
    try {
      this.log.debug(this.rawEvent);

      const owner = this.rawEvent.requestContext.authorizer.claims['cognito:groups'];
      const devices = await this.db.listDevice(owner);

      return this.resp.ok({ status: 'success', devices });
    } catch (err) {
      this.log.error(err);
      return this.resp.internalError({ error: ListDeviceError.generalError });
    }
  }
}
