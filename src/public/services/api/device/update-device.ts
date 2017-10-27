import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const UpdateDevice = {
  Service,
  Function: 'update-device'
} as FuncDef<UpdateDevice.Request, HTTP.Response<UpdateDevice.Response>>;

export const enum UpdateDeviceError {
  generalError = 'fail to update device',
  noDevice = 'specific deviceUuid not exist: ',
  notOwner = 'unauthorized to update device: ',
}

export const UpdateDeviceValidator = Joi.object({
  method: Joi.string().valid('POST', 'PUT'),
  parameters: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }),
});

export namespace UpdateDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST' | 'PUT';
    parameters: {
      deviceUuid: string;
    };
    body: Partial<Device>;
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
