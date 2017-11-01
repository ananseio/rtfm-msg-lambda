import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {GET} /record/<recordUuid> Get Record
 * @apiName get-record
 * @apiVersion 0.0.1
 * @apiGroup Record
 * @apiPermission member
 * @apiDescription Get a specific record.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} recordUuid
 * @apiParamExample {json} Request-Example
 *     GET /rtfm/record/xxxxxxxx-xxxx-xxxx-xxxxxxxxxx HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Record} record
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "record": {
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
 *       }
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} No-Record-Error
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "specific recordUuid not exist: abcdefgh-xxxx-xxxx-xxxxxxxxxxxxxx"
 *     }
 * @apiErrorExample {json} Not-Owner-Error
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "unauthorized to access record: abcdefgh-xxxx-xxxx-xxxxxxxxxxxxxx"
 *     }
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to get record"
 *     }
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
