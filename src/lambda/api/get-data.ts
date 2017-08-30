import { FunctionHandler, Handler, HTTP, Log, Logger } from '@ananseio/serverless-common';
import { DB } from '../../lib';
import { Heartbeat } from '../../lib/models/heartbeat';
import { GetData } from '../../public';

export class SNSDataQueryHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  @Handler
  @Log(HTTP)
  @HTTP()
  public async handler(event: GetData.Request): Promise<HTTP.Response<GetData.Response>> {
    const since: number = Number(event.query.since) || 0;
    const until: number = Number(event.query.until) || Date.now();

    console.log({since, until});

    return this.resp.ok({
      error: null,
      result: [],
    });
  }
}
