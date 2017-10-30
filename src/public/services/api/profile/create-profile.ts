import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Profile } from '../../../types';
import * as Joi from 'joi';

/**
 *
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
