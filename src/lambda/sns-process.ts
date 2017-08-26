import { FunctionHandler, Handler, Log, Logger } from '@ananseio/serverless-common';
import { DB } from '../lib';
import { HeartbeatDeviceTS, HeartbeatTimeseries } from '../lib/models/heartbeat';
import { flattenSnsMessage } from '../lib/heartbeat';
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

    const allheartbeats = records.reduce((allHbs, snsMessage) => {
      const msgBuf = new Buffer(snsMessage!.Sns!.Message! || '', 'base64');
      const heartbeats: HeartbeatDeviceTS = JSON.parse(msgBuf.toString());

      const hbts = new HeartbeatTimeseries();
      flattenSnsMessage(heartbeats).forEach(hb => hbts.add(hb));

      return [...allHbs, ...hbts.heartbeat];
    }, []);

    this.log.info(allheartbeats);
    return;
  }
}
