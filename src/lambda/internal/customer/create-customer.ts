/**
 * workflow:
 * 1. create Customer
 * 2. create Cognito User Group
 * 3. create IoT Policy
 */

import { FunctionHandler, Handler, Log, Logger } from '@ananseio/serverless-common';
import { CustomerDB, SES, Congito, IoT } from '../../../lib';
import { CreateCustomer, CreateCustomerValidator } from '../../../public';
import * as Joi from 'joi';
import * as uuid from 'uuid/v4';

/**
 * Function handler
 */
export class CreateCustomerHandler extends FunctionHandler {
  public static handler: Function;
  public log: Logger;

  private db = new CustomerDB();
  private ses = new SES();
  private cognito = new Congito();
  private iot = new IoT();

  @Handler
  @Log()
  public async handler(event: CreateCustomer.Event): Promise<CreateCustomer.Response> {
    try {
      this.log.debug(event);
      const isValid = Joi.validate(event, CreateCustomerValidator, { abortEarly: false });
      if (isValid.error) {
        this.log.error(isValid.error.message);
        return;
      }

      const token = uuid().replace(/-/g, '');
      const customerName = event.name;
      await this.db.createCustomer(customerName, event.shortCode, event.email, token, event.description);
      await this.cognito.createUserGroup(customerName);
      await this.iot.createPolicy(`rtfm-policy-${customerName}`, this.iot.generateCusomterPolicy(customerName));
      await this.ses.sendNewCustomerEmail(event.email, customerName, token);

      return;
    } catch (err) {
      this.log.error(err);
      return;
    }
  }
}
