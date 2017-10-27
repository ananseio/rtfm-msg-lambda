import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const DeleteRecord = {
  Service,
  Function: 'delete-record'
} as FuncDef<DeleteRecord.Request, HTTP.Response<DeleteRecord.Response>>;

export enum DeleteRecordError {
  generalError = 'fail to delete record',
  noRecord = 'specific recordUuid not exist: ',
  notOwner = 'unauthorized to delete record: ',
}

export const DeleteRecordValidator = Joi.object({
  method: Joi.string().valid('DELETE'),
  parameters: Joi.object({
    recordUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
});

export namespace DeleteRecord {
  export interface Request extends HTTP.Event<{}> {
    method: 'DELETE';
    parameters: {
      recordUuid: string;
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
