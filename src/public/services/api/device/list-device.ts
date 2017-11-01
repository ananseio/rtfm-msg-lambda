import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';

/**
 * @api {GET} /device List Device
 * @apiName list-device
 * @apiVersion 0.0.1
 * @apiGroup Device
 * @apiPermission member
 * @apiDescription List all devices belongs to the user.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParamExample {json} Request-Example
 *     GET /rtfm/device HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Device[]} devices
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "devices": [{
 *         "deviceUuid": "XXXXXXXX-XXXX-XXXX-XXXXXXXXX",
 *         "deviceId": "34862",
 *         "serial": "XXXXXXXXXXXX",
 *         "name": "device-001",
 *         "owner": "customer1",
 *         "description": "hello world"
 *       },{
 *         "deviceUuid": "YYYYYYYY-YYYY-YYYY-YYYYYYYY",
 *         "deviceId": "00002",
 *         "serial": "YYYYYYYYYYYY",
 *         "name": "device-002",
 *         "owner": "customer1",
 *         "description": "hello world2"
 *       }]
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to list device"
 *     }
 */
export const ListDevice = {
  Service,
  Function: 'list-device'
} as FuncDef<ListDevice.Request, HTTP.Response<ListDevice.Response>>;

export const enum ListDeviceError {
  generalError = 'fail to list device',
}

export namespace ListDevice {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
  }

  export interface NormalResponse {
    status: string;
    devices: Device[];
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
