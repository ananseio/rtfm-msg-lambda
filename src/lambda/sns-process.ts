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
    const records = event.Records;

    const allheartbeats = records.reduce((accum, snsMessage) => {
      const msgBuf = new Buffer(snsMessage!.Sns!.Message! || '', 'base64');
      const heartbeats = JSON.parse(msgBuf.toString());

      const hbArray = Object.keys(heartbeats)
        .reduce((arr, deviceID) => {
          return [...arr, heartbeats[deviceID]];
        }, []);

      return [...accum, hbArray];
    }, []);

    this.log.info(allheartbeats);

    return;
  }
}
