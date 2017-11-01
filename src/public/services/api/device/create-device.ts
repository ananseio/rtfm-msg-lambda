import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import * as Joi from 'joi';

/**
 * @api {POST} /device Create Device
 * @apiName create-device
 * @apiVersion 0.0.1
 * @apiGroup Device
 * @apiPermission member
 * @apiDescription Create a new device.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} deviceId A device identifier got from hardware. *Note: deviceId should be string even though it is number-like.
 * @apiParam {String} serial A serial number got from hardware.
 * @apiParam {String} [name=SameAsDeviceId] Name of the device.
 * @apiParam {String} [description]
 * @apiParamExample {json} Request-Example
 *     POST /rtfm/device HTTP/1.1
 *     {
 *       "deviceId": "34862",
 *       "serial": "SE-3062470030624770"
 *     }
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {String} deviceUuid
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "deviceuuid": "XXXXXXXX-XXXX-XXXX-XXXXXXXXX"
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to create device"
 *     }
 */
export const CreateDevice = {
  Service,
  Function: 'create-device'
} as FuncDef<CreateDevice.Request, HTTP.Response<CreateDevice.Response>>;

export const enum CreateDeviceError {
  generalError = 'fail to create device',
}

export const CreateDeviceValidator = Joi.object({
  method: Joi.string().valid('POST'),
  body: Joi.object({
    deviceId: Joi.string().required(),
    serial: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
  })
});

export namespace CreateDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST';
    body: Device;
  }

  export interface NormalResponse {
    status: string;
    deviceUuid: string;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
