import * as zlib from 'zlib';

import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';

import { DB } from '../../lib';
import { Heartbeat } from '../../lib/models/heartbeat';
import { GetData, GetDataError } from '../../public';

export class SNSDataQueryHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new DB();

  @Handler
  @Log(HTTP)
  @HTTP({ respFormat: 'raw', cors: { credentials: true } })
  public async handler(event: GetData.Request): Promise<HTTP.Response<GetData.Response>> {
    try {
      this.log.debug(this.rawEvent);

      const deviceId: string = event.query.deviceId || '';
      const since: number = parseInt(event.query.since || '0');
      const until: number = parseInt(event.query.until || `${Date.now()}`);

      this.log.info('start querying heartbeat');
      const heartbeats: Heartbeat[] = await this.db.getHeartbeat(deviceId, since, until);

      this.log.trace({ heartbeats }, 'query result');
      this.resp.headers = {
        ...this.resp.headers,
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/gzip',
      };

      return this.resp.ok(zlib.gzipSync(JSON.stringify({
        error: null,
        result: heartbeats,
      })));
    } catch (err) {
      this.log.error(err, 'failed to query heartbeats');
      return this.resp.internalError({ error: GetDataError.InternalFailure });
    }
  }
}
