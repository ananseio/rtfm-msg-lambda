import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';

/**
 * @api {GET} /profile List Profile
 * @apiName list-profile
 * @apiVersion 0.0.1
 * @apiGroup Profile
 * @apiPermission member
 * @apiDescription List all profiles belongs to the user.
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
 *     GET /rtfm/profile HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Profile[]} profiles
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "profiles": [{
 *         "profileUuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXX",
 *         "name": "profile-001",
 *         "owner": "customer1",
 *         "description": "hello world",
 *         "groups": ["running", "swimming", "S3"]
 *       },{
 *         "profileUuid": "YYYYYYYY-YYYY-YYYY-YYYYYYYY",
 *         "name": "profile-002",
 *         "owner": "customer1"
 *       }]
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to list profile"
 *     }
 */
export const ListProfile = {
  Service,
  Function: 'list-profile'
} as FuncDef<ListProfile.Request, HTTP.Response<ListProfile.Response>>;

export enum ListProfileError {
  generalError = 'fail to list profile',
}

export namespace ListProfile {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
  }

  export interface NormalResponse {
    status: string;
    profiles: Profile[];
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
