import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';

/**
 *
 */
export const ListProfile = {
  Service,
  Function: 'list-profile'
} as FuncDef<ListProfile.Request, HTTP.Response<ListProfile.Response>>;

export enum ListProfileError {
  generalError = 'fail to list profile',
}

export namespace ListProfile {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
  }

  export interface NormalResponse {
    status: string;
    profiles: Profile[];
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
