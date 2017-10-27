import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Device } from '../../../types';
import { uuidV4Regex } from '../../../schema';
import * as Joi from 'joi';

/**
 *
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
