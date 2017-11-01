import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {GET} /device/<deviceUuid> Get Device
 * @apiName get-device
 * @apiVersion 0.0.1
 * @apiGroup Device
 * @apiPermission member
 * @apiDescription Get a specific device.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} deviceUuid A device identifier got from create-device/list-device.
 * @apiParamExample {json} Request-Example
 *     GET /rtfm/device/xxxxxxxx-xxxx-xxxx-xxxxxxxxxx HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Device} device
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "device": {
 *         "deviceUuid": "XXXXXXXX-XXXX-XXXX-XXXXXXXXX",
 *         "deviceId": "34862",
 *         "serial": "XXXXXXXXXXXX",
 *         "name": "device-001",
 *         "owner": "customer1",
 *         "description": "hello world"
 *       }
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
 *       "error": "fail to get device"
 *     }
 */
export const GetDevice = {
  Service,
  Function: 'get-device'
} as FuncDef<GetDevice.Request, HTTP.Response<GetDevice.Response>>;

export const enum GetDeviceError {
  generalError = 'fail to get device',
  noDevice = 'specific deviceUuid not exist: ',
  notOwner = 'unauthorized to access device: ',
}

export const GetDeviceValidator = Joi.object({
  method: Joi.string().valid('GET'),
  parameters: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
});

export namespace GetDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
    parameters: {
      deviceUuid: string;
    }
  }

  export interface NormalResponse {
    status: string;
    device: Device;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
