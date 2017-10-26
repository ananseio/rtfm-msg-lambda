import { SNSDataQueryHandler } from './api/get-data';
import { RequestAttachPolicyHandler } from './api/request-attach-policy';

export = {
  'get-data': SNSDataQueryHandler.handler,
  'request-attach-policy': RequestAttachPolicyHandler.handler,
};
