import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {POST,PUT} /device/<deviceUuid> Update Device
 * @apiName update-device
 * @apiVersion 0.0.1
 * @apiGroup Device
 * @apiPermission member
 * @apiDescription Update a specific device.
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
 * @apiParam {String} [name] Name of the device.
 * @apiParam {String} [description]
 * @apiParamExample {json} Request-Example
 *     PUT /rtfm/device/xxxxxxxx-xxxx-xxxx-xxxxxxxx HTTP/1.1
 *     {
 *       "name": "device-001-new",
 *       "description": "description-new"
 *     }
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {String} deviceUuid
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "device": {
 *         "deviceUuid": "XXXXXXXX-XXXX-XXXX-XXXXXXXXX",
 *         "deviceId": "34862",
 *         "serial": "XXXXXXXXXXXX",
 *         "name": "device-001-new",
 *         "owner": "customer1",
 *         "description": "description-new"
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
 *       "error": "fail to update device"
 *     }
 */
export const UpdateDevice = {
  Service,
  Function: 'update-device'
} as FuncDef<UpdateDevice.Request, HTTP.Response<UpdateDevice.Response>>;

export const enum UpdateDeviceError {
  generalError = 'fail to update device',
  noDevice = 'specific deviceUuid not exist: ',
  notOwner = 'unauthorized to update device: ',
}

export const UpdateDeviceValidator = Joi.object({
  method: Joi.string().valid('POST', 'PUT'),
  parameters: Joi.object({
    deviceUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }),
});

export namespace UpdateDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST' | 'PUT';
    parameters: {
      deviceUuid: string;
    };
    body: Partial<Device>;
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
