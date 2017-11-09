import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {POST,PUT} /profile/<profileUuid> Update Profile
 * @apiName update-profile
 * @apiVersion 0.0.1
 * @apiGroup Profile
 * @apiPermission member
 * @apiDescription Update a specific profile.
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
 * @apiParam {String} [name] Name of the profile.
 * @apiParam {String} [description]
 * @apiParam {String[]} [groups] An array of tags/groups. Replace the whole array, NOT SUPPORT individual add/remove.
 * @apiParamExample {json} Request-Example
 *     PUT /rtfm/profile/xxxxxxxx-xxxx-xxxx-xxxxxxxx HTTP/1.1
 *     {
 *       "name": "profile-001-new",
 *       "description": "description-new",
 *       "groups": ["running", "S4"]
 *     }
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
 *         "name": "profile-001-new",
 *         "owner": "customer1",
 *         "description": "description-new",
 *         "groups": ["running", "S4"]
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
 *       "error": "fail to update profile"
 *     }
 */
export const UpdateProfile = {
  Service,
  Function: 'update-profile'
} as FuncDef<UpdateProfile.Request, HTTP.Response<UpdateProfile.Response>>;

export const enum UpdateProfileError {
  generalError = 'fail to update profile',
  noProfile = 'specific profileUuid not exist: ',
  notOwner = 'unauthorized to update profile: ',
}

export const UpdateProfileValidator = Joi.object({
  method: Joi.string().valid('POST', 'PUT'),
  parameters: Joi.object({
    profileUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
  body: Joi.object({
    name: Joi.string().allow(''),
    description: Joi.string().allow(''),
    groups: Joi.array().items(Joi.string()),
  }),
})

export namespace UpdateProfile {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST' | 'PUT';
    parameters:{
      profileUuid: string;
    },
    body: {
      name?: string;
      description?: string;
      groups?: string[];
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
