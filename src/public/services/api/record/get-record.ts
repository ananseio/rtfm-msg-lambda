import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const GetRecord = {
  Service,
  Function: 'get-record'
} as FuncDef<GetRecord.Request, HTTP.Response<GetRecord.Response>>;

export enum GetRecordError {
  generalError = 'fail to get record',
  noRecord = 'specific recordUuid not exist: ',
  notOwner = 'unauthorized to access record: ',
}

export const GetRecordValidator = Joi.object({
  method: Joi.string().valid('GET'),
  parameter: Joi.object({
    recordUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
})

export namespace GetRecord {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
    parameters: {
      recordUuid: string;
    };
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
