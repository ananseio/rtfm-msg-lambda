import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {POST,PUT} /record/<recordUuid>/<action> Update Record
 * @apiName update-record
 * @apiVersion 0.0.1
 * @apiGroup Record
 * @apiPermission member
 * @apiDescription Update a specific record.
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
 * @apiParam {String="_stop"} [action] To stop the action, request /record/<recordUuid>/_stop. To normal update of record, just /record/<recordUuid>
 * @apiParam {String} [name] Name of the record.
 * @apiParam {String} [description]
 * @apiParamExample {json} Request-Example
 *     PUT /rtfm/record/xxxxxxxx-xxxx-xxxx-xxxxxxxx/_stop HTTP/1.1
 *     {
 *       "name": "record-001-new",
 *       "description": "description-new"
 *     }
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Profile} record
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
 * @apiErrorExample {json} Repeat-Stop-Error
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "the record had been stopped before"
 *     }
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to update record"
 *     }
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
