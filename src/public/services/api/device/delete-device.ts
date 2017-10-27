import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const DeleteDevice = {
  Service,
  Function: 'delete-device'
} as FuncDef<DeleteDevice.Request, HTTP.Response<DeleteDevice.Response>>;

export const enum DeleteDeviceError {
  generalError = 'fail to delete device',
  noDevice = 'specific deviceUuid not exist: ',
  notOwner = 'unauthorized to access device: ',
}

export const DeleteDeviceValidator = Joi.object({
  method: Joi.string().valid('DELETE'),
  parameters: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
});

export namespace DeleteDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'DELETE';
    parameters: {
      deviceUuid: string;
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
