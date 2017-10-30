import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const UpdateRecord = {
  Service,
  Function: 'update-record'
} as FuncDef<UpdateRecord.Request, HTTP.Response<UpdateRecord.Response>>;

export enum UpdateRecordError {
  generalError = 'fail to update record',
  noRecord = 'specific recordUuid not exist: ',
  notOwner = 'unauthorized to access record: ',
  repeatStop = 'the record had been stopped before',
}

export const UpdateRecordValidator = Joi.object({
  method: Joi.string().valid('POST', 'PUT'),
  paramaters: Joi.object({
    recordUuid: Joi.string().regex(uuidV4Regex).required(),
    action: Joi.string().valid('_stop'),
  }),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }),
});

export namespace UpdateRecord {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST' | 'PUT';
    parameters: {
      recordUuid: string;
      action?: '_stop';
    },
    body: {
      name?: string;
      description?: string;
    }
  }

  export interface NormalResponse {
    status: string;
    record: Record;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
