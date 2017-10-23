import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Heartbeat } from '../../../lib/models/heartbeat';
import { Service } from '../../types';

/**
 * Search resume by conditions
 */
export const GetData = {
  Service,
  Function: 'get-data'
} as FuncDef<GetData.Request, HTTP.Response<GetData.Response>>;

export const enum GetDataError {
  InvalidRequest = 'invalid request',
  InternalFailure = 'internal failure',
}

export namespace GetData {
  export interface Request extends HTTP.Event<{}> {
    query: {
      deviceId: string;
      since?: string;
      until?: string;
    };
  }

  export interface ErrorResponse {
    error: GetDataError;
  }

  export interface OkResponse {
    error: null;
    result?: Heartbeat[];
  }

  export type Response = OkResponse | ErrorResponse | Buffer;
}
