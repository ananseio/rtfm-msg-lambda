import { FunctionHandler, Handler, Log, Logger } from '@ananseio/serverless-common';
import { DB } from '../lib';
import { Heartbeat, HeartbeatTimeseries } from '../lib/models/heartbeat';
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

    const heartbeatTS = records.reduce((hbts, snsMessage) => {
      const msgBuf = new Buffer(snsMessage!.Sns!.Message! || '', 'base64');
      const heartbeats: Heartbeat[] = JSON.parse(msgBuf.toString());

      heartbeats.forEach(hb => hbts.add(hb));

      return hbts;
    }, new HeartbeatTimeseries());

    this.log.debug({heartbeatTS});

    await Promise.all(heartbeatTS.heartbeat.map((heartbeat) => {
      return this.db.putHeartbeat(heartbeat)
        .catch((err: Error) => {
          this.log.warn({err}, 'dynamodb error occurred');
        });
    }));

    return;
  }
}
