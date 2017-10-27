import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const GetDevice = {
  Service,
  Function: 'get-device'
} as FuncDef<GetDevice.Request, HTTP.Response<GetDevice.Response>>;

export const enum GetDeviceError {
  generalError = 'fail to get device',
  noDevice = 'specific deviceUuid not exist: ',
  notOwner = 'unauthorized to access device: ',
}

export const GetDeviceValidator = Joi.object({
  method: Joi.string().valid('GET'),
  parameters: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
});

export namespace GetDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
    parameters: {
      deviceUuid: string;
    }
  }

  export interface NormalResponse {
    status: string;
    device: Device;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
