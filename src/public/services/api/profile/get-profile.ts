import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
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
