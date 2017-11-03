import { FuncDef, HTTP } from '@ananseio/serverless-common';
import { Service, Record } from '../../../types';
import * as Joi from 'joi';

/**
 * @api {POST} /user Create User
 * @apiName create-user
 * @apiVersion 0.0.1
 * @apiGroup User
 * @apiPermission member
 * @apiDescription Create a new user.
 *
 * @apiParam {String} username A username consist of lower case letters and numbers only. EXCLUDING the customer name prefix.
 * @apiParam {String} email The email of USER. The one-time-password will be sent to here.
 * @apiParam {String} customerName
 * @apiParam {String} token The secret token of the customer.
 * @apiParamExample {json} Request-Example
 *     POST /rtfm/user HTTP/1.1
 *     {
 *       "username": "ctm",
 *       "email": "ctm@dbs.edu.hk",
 *       "customerName": "DBS",
 *       "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 *     }
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
 * @apiErrorExample {json} Customer-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "specific customer not exist: HKNOIT"
 *     }
 * @apiErrorExample {json} Authentication-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "secret token invalid"
 *     }
 * @apiErrorExample {json} Unknown-Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "fail to create user"
 *     }
 */
export const CreateUser = {
  Service,
  Function: 'create-user'
} as FuncDef<CreateUser.Request, HTTP.Response<CreateUser.Response>>;

export enum CreateUserError {
  generalError = 'fail to create user',
  customerError = 'specific customer not exist: ',
  authenticationError = 'secret token invalid',
}

export const CreateUserValidator = Joi.object({
  method: Joi.string().valid('POST'),
  body: Joi.object({
    username: Joi.string().alphanum().lowercase().required(),
    email: Joi.string().email().required(),
    cusomterName: Joi.string().required(),
    token: Joi.string().alphanum().length(32).required(),
  }),
});

export namespace CreateUser {
  export interface Request extends HTTP.Event<{}> {
    method: 'POST';
    body: {
      username: string;
      email: string;
      customerName: string;
      token: string;
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
