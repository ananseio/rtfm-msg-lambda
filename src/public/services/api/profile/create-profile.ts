import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';
import * as Joi from 'joi';

/**
 * @api {POST} /profile Create Profile
 * @apiName create-profile
 * @apiVersion 0.0.1
 * @apiGroup Profile
 * @apiPermission member
 * @apiDescription Create a new profile (a virtual identity, usually a student).
 *
 * @apiHeader {String} X-aws-authorizer The jwt token got from cognito login.
 * @apiHeaderExample {json} Authorization-Header
 *     {
 *       "X-aws-authorizer": "ey...........x2046",
 *       "Content-Type": "application/json",
 *       "origin": "https://rtfm.dev.ananse.io"
 *     }
 *
 * @apiParam {String} [name="new profile"] Name of the profile.
 * @apiParam {String} [description]
 * @apiParam {String[]} [groups] An array of tags/groups.
 * @apiParamExample {json} Request-Example
 *     POST /rtfm/profile HTTP/1.1
 *     {
 *       "name": "student-001",
 *       "description": "XXXXXX",
 *       "groups": ["running", "swimming", "S3"]
 *     }
 *
 * @apiSampleRequest https://rtfm-api.dev.ananse.io
 * @apiSuccess {String} status
 * @apiSuccess {String} profileUuid
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "profileUuid": "XXXXXXXX-XXXX-XXXX-XXXXXXXXX"
 *     }
 *
 * @apiError {String} error
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to create profile"
 *     }
 */
export const CreateProfile = {
  Service,
  Function: 'create-profile'
} as FuncDef<CreateProfile.Request, HTTP.Response<CreateProfile.Response>>;

export enum CreateProfileError {
  generalError = 'fail to create profile',
}

export const CreateProfileValidator = Joi.object({
  method: Joi.string().valid('POST'),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    groups: Joi.array().items(Joi.string()),
  }),
});

export namespace CreateProfile {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST';
    body: {
      name?: string;
      description?: string;
      groups?: string[];
    };
  }

  export interface NormalResponse {
    status: string;
    profileUuid: string;
  }

  export interface ErrorResponse {
    error: string;
  }

  export type Response = NormalResponse | ErrorResponse;
}
