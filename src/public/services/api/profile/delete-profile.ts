import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 * @api {DELETE} /profile/<profileUuid> Delete Profile
 * @apiName delete-profile
 * @apiVersion 0.0.1
 * @apiGroup Profile
 * @apiPermission member
 * @apiDescription Delete a existing profile.
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
 * @apiParamExample {Device} Request-Example
 *     DELETE /rtfm/profile/xxxxxxxx-xxxx-xxxx-xxxxxxxxxx HTTP/1.1
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
 *       "error": "fail to delete profile"
 *     }
 */
export const DeleteProfile = {
  Service,
  Function: 'delete-profile'
} as FuncDef<DeleteProfile.Request, HTTP.Response<DeleteProfile.Response>>;

export enum DeleteProfileError {
  generalError = 'fail to delete profile',
  noProfile = 'specific profileUuid not exist: ',
  notOwner = 'unauthorized to access profile: ',
}

export const DeleteProfileValidator = Joi.object({
  method: Joi.string().valid('DELETE'),
  parameters: Joi.object({
    profileUuid: Joi.string().regex(uuidV4Regex).required(),
  }),
});

export namespace DeleteProfile {
  export interface Request extends HTTP.Event<{}> {
    method: 'DELETE';
    parameters: {
      profileUuid: string;
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
