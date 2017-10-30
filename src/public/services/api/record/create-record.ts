import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const CreateRecord = {
  Service,
  Function: 'create-record'
} as FuncDef<CreateRecord.Request, HTTP.Response<CreateRecord.Response>>;

export enum CreateRecordError {
  generalError = 'fail to create record',
  profileError = 'invalid profile. The profile may not exist or you are not authorized to access it',
  deviceError = 'invalid device. The device may not exist or you are not authorized to access it',
}

export const CreateRecordValidator = Joi.object({
  method: Joi.string().valid('POST'),
  body: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
    profileUuid: Joi.string().regex(uuidV4Regex).required(),
    name: Joi.string(),
    description: Joi.string(),
  }),
})

export namespace CreateRecord {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST';
    body: {
      profileUuid: string;
      deviceUuid: string;
      name?: string;
      description?: string;
    }
  }

  export interface NormalResponse {
    status: string;
    recordUuid: string;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
