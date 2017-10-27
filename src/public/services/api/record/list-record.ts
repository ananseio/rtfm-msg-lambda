import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
 */
export const ListRecord = {
  Service,
  Function: 'list-record'
} as FuncDef<ListRecord.Request, HTTP.Response<ListRecord.Response>>;

export enum ListRecordError {
  generalError = 'fail to list record',
}

export const ListRecordValidator = Joi.object({
  method: Joi.string().valid('GET'),
  query: Joi.object({
    profileUuid: Joi.string().regex(uuidV4Regex),
    startTime: Joi.number().integer(),
    endTime: Joi.number().integer(),
  }),
});

export namespace ListRecord {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
    query: {
      profileUuid: string;
      startTime: string;
      endTime: string;
    };
  }

  export interface NormalResponse {
    status: string;
    records: Record[];
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
