import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';

/**
 *
 */
export const ListDevice = {
  Service,
  Function: 'list-device'
} as FuncDef<ListDevice.Request, HTTP.Response<ListDevice.Response>>;

export const enum ListDeviceError {
  generalError = 'fail to list device',
}

export namespace ListDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
  }

  export interface NormalResponse {
    status: string;
    devices: Device[];
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
