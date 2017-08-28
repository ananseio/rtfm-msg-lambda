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

    const heartbeatPromises = records.map((snsMessage) => {
      const msgBuf = new Buffer(snsMessage!.Sns!.Message! || '', 'base64');
      const msgJson: {
        nodeId: string,
        timestamp: number,
        heartbeats: Heartbeat[]
      } = JSON.parse(msgBuf.toString());

      return this.db.putHeartbeat(msgJson.nodeId, msgJson.timestamp, msgJson.heartbeats)
        .catch((err: Error) => {
          this.log.warn({err}, 'dynamodb error occurred');
        });
    });

    await Promise.all(heartbeatPromises);

    return;
  }
}
