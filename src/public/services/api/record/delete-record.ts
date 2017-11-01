import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {DELETE} /record/<recordUuid> Delete Record
 * @apiName delete-record
 * @apiVersion 0.0.1
 * @apiGroup Record
 * @apiPermission member
 * @apiDescription Delete a specific record.
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
 * @apiParamExample {Device} Request-Example
 *     DELETE /rtfm/record/xxxxxxxx-xxxx-xxxx-xxxxxxxxxx HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
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
 *       "error": "fail to delete record"
 *     }
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
