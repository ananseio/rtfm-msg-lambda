import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import * as Joi from 'joi';

/**
 *
 */
export const CreateDevice = {
  Service,
  Function: 'create-device'
} as FuncDef<CreateDevice.Request, HTTP.Response<CreateDevice.Response>>;

export const enum CreateDeviceError {
  generalError = 'fail to create device',
}

export const CreateDeviceValidator = Joi.object({
  method: Joi.string().valid('POST'),
  body: Joi.object({
    deviceId: Joi.string().required(),
    serial: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
  })
});

export namespace CreateDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST';
    body: Device;
  }

  export interface NormalResponse {
    status: string;
    deviceUuid: string;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
