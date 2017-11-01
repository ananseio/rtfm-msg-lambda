import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {POST} /record Create Record
 * @apiName create-record
 * @apiVersion 0.0.1
 * @apiGroup Record
 * @apiPermission member
 * @apiDescription Create a new record.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} profileUuid
 * @apiParam {String} deviceUuids
 * @apiParam {String} [name="PROFILE_NAME - DATE"] Name of the record.
 * @apiParam {String} [description]
 * @apiParamExample {json} Request-Example
 *     POST /rtfm/record HTTP/1.1
 *     {
 *       "profileUuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *       "deviceUuid": "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY",
 *       "name": "record-001",
 *       "description": "XXXXXX"
 *     }
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {String} recordUuid
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "recordUuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX"
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} Profile-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "invalid profile. The profile may not exist or you are not authorized to access it"
 *     }
 * @apiErrorExample {json} Device-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "invalid device. The device may not exist or you are not authorized to access it"
 *     }
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to create record"
 *     }
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
