import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
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
    name: Joi.string(),
    description: Joi.string(),
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
