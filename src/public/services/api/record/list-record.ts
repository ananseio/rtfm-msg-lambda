import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {GET} /record List Record
 * @apiName list-record
 * @apiVersion 0.0.1
 * @apiGroup Record
 * @apiPermission member
 * @apiDescription List all records belongs to the user.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} [profileUuid]
 * @apiParam {Number} [startTime]
 * @apiParam {Number} [endTime] *Note: If the record doesn't finished, you MUST ignore endTime parameter to search that record.
 * @apiParamExample {json} Request-Example
 *     GET /rtfm/record?profileUuid=XXXXX-XXXXX-XXXXX-XXXX&startTime=15000000000000&endTime=15100000000000 HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Record[]} records
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "records": [{
 *         "recordUuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXX",
 *         "profileUuid": "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYYY",
 *         "deviceUuid": "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZZ",
 *         "name": "record-001",
 *         "owner": "customer1",
 *         "description": "hello world",
 *         "startTime": 15000000000000,
 *         "endTime": 15100000000000,
 *         "dataPoints": [{
 *           "timestamp": 1509353121992,
 *           "hearbeat": 75
 *         },{
 *           "timestamp": 1509353121995,
 *           "hearbeat": 74
 *         }]
 *       },{
 *         "recordUuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX2"
 *         "profileUuid": "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYYY",
 *         "deviceUuid": "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZZ",
 *         "name": "record-002",
 *         "owner": "customer1",
 *         "startTime": 15010000000000
 *       }]
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to list record"
 *     }
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
      profileUuid?: string;
      startTime?: string;
      endTime?: string;
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
