import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {DELETE} /device/<deviceUuid> Delete Device
 * @apiName delete-device
 * @apiVersion 0.0.1
 * @apiGroup Device
 * @apiPermission member
 * @apiDescription Delete a existing device.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} deviceUuid
 * @apiParamExample {Device} Request-Example
 *     DELETE /rtfm/device/xxxxxxxx-xxxx-xxxx-xxxxxxxxxx HTTP/1.1
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
 * @apiErrorExample {json} No-Device-Error
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "specific deviceUuid not exist: abcdefgh-xxxx-xxxx-xxxxxxxxxxxxxx"
 *     }
 * @apiErrorExample {json} Not-Owner-Error
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "unauthorized to access device: abcdefgh-xxxx-xxxx-xxxxxxxxxxxxxx"
 *     }
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to delete device"
 *     }
 */
export const DeleteDevice = {
  Service,
  Function: 'delete-device'
} as FuncDef<DeleteDevice.Request, HTTP.Response<DeleteDevice.Response>>;

export const enum DeleteDeviceError {
  generalError = 'fail to delete device',
  noDevice = 'specific deviceUuid not exist: ',
  notOwner = 'unauthorized to access device: ',
}

export const DeleteDeviceValidator = Joi.object({
  method: Joi.string().valid('DELETE'),
  parameters: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
});

export namespace DeleteDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'DELETE';
    parameters: {
      deviceUuid: string;
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
