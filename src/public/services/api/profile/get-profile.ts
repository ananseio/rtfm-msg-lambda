import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {GET} /profile/<profileUuid> Get Profile
 * @apiName get-profile
 * @apiVersion 0.0.1
 * @apiGroup Profile
 * @apiPermission member
 * @apiDescription Get a specific profile.
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} profileUuid A profile identifier got from create-profile/list-profile.
 * @apiParamExample {json} Request-Example
 *     GET /rtfm/profile/xxxxxxxx-xxxx-xxxx-xxxxxxxxxx HTTP/1.1
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {Profile} profile
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "profile": {
 *         "profileUuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXX",
 *         "name": "profile-001",
 *         "owner": "customer1",
 *         "description": "hello world",
 *         "groups": ["running", "swimming", "S3"]
 *       }
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} No-Profile-Error
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "specific profileUuid not exist: abcdefgh-xxxx-xxxx-xxxxxxxxxxxxxx"
 *     }
 * @apiErrorExample {json} Not-Owner-Error
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "unauthorized to access profile: abcdefgh-xxxx-xxxx-xxxxxxxxxxxxxx"
 *     }
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to get profile"
 *     }
 */
export const GetProfile = {
  Service,
  Function: 'get-profile'
} as FuncDef<GetProfile.Request, HTTP.Response<GetProfile.Response>>;

export enum GetProfileError {
  generalError = 'fail to get profile',
  noProfile = 'specific profileUuid not exist: ',
  notOwner = 'unauthorized to access profile: ',
}

export const GetProfileValidator = Joi.object({
  method: Joi.string().valid('GET'),
  parameters: Joi.object({
    profileUuid: Joi.string().regex(uuidV4Regex).required(),
  })
});

export namespace GetProfile {
  export interface Request extends HTTP.Event<{}> {
    method: 'GET';
    parameters: {
      profileUuid: string;
    }
  }

  export interface NormalResponse {
    status: string;
    profile: Profile;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
