import { FuncDef } from '@ananseio/serverless-common';
import { Service } from '../../../types';
import * as Joi from 'joi';

/**
 * @api {INVOKE} N/A Create Customer
 * @apiName create-customer
 * @apiVersion 0.0.1
 * @apiGroup Customer
 * @apiDescription Internally create a new customer. This lambda function only create customer object in database and prepare related resource in Cognito User Group, IoT Policy. Payment of other pre-request are not processed here.
 *
 * @apiParam {String} name Name of the customer. For easier the IoT Rule naming in future, name SHOULD consist of alphanumeric and underscore(_) only.
 * @apiParam {String} shortCode The short code representing the customer. Lower case alphanumeric with length 2 - 5. Any user register under this customer will be prepended with this code, e.g. als-user001
 * @apiParam {String} email Email of the customer. The secret token will be sent to this email.
 * @apiParam {String} description
 * @apiParamExample {json} Event-Sample
 *     {
 *       "name": "Ananse_Limited_School",
 *       "shortCode": "als",
 *       "email": "anansecloudapp@gmail.com",
 *       "description": "XXXXXXX",
 *     }
 */
export const CreateCustomer = {
  Service,
  Function: 'create-customer'
} as FuncDef<CreateCustomer.Event, CreateCustomer.Response>;

export const CreateCustomerValidator = Joi.object({
  name: Joi.string().required(),
  shortCode: Joi.string().alphanum().lowercase().min(2).max(5).required(),
  email: Joi.string().email().required(),
  description: Joi.string(),
});

export namespace CreateCustomer {
  export interface Event {
    name: string;
    shortCode: string;
    description?: string;
    email: string;
  }

  export type Response = void;
}
