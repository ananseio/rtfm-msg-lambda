import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service } from '../../types';

/**
 *
 */
export const RequestAttachPolicy = {
  Service,
  Function: 'request-attach-policy'
} as FuncDef<RequestAttachPolicy.Request, HTTP.Response<RequestAttachPolicy.Response>>;

export namespace RequestAttachPolicy {
  export interface Request extends HTTP.Event<{}> {
    parameters: {
      identityId: string;
    }
  }

  export interface NormalResponse {
    status: string;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
