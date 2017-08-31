import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service } from '../../types';
import { Heartbeat } from '../../../lib/models/heartbeat';

/**
 * Search resume by conditions
 */
export const GetData = {
  Service,
  Function: 'get-data'
} as FuncDef<GetData.Request, HTTP.Response<GetData.Response>>;

export const enum GetDataError {
  InvalidRequest = 'invalid request',
  InternalFailure = 'internal failure'
}

export namespace GetData {
  export interface Request extends HTTP.Event<{}> {
    query: {
      nodeId: string;
      since?: string;
      until?: string;
    }
  }

  export interface ErrorResponse {
    error: GetDataError;
  }

  export interface OkResponse {
    error: null;
    result: Heartbeat[];
  }

  export type Response = OkResponse | ErrorResponse;
}
