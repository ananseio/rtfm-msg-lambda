import { FunctionHandler, Handler, Log, Logger } from '@ananseio/serverless-common';
import { DB } from '../lib';
import { SNSHeartbeatMessageEvent } from '../public';

/**
 * Function handler
 */
export class SNSHeartbeatMessageHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DB();

  @Handler
  @Log()
  public async handler(event: SNSHeartbeatMessageEvent) {
    this.log.debug({event}, 'msg received');
    return;
  }
}
