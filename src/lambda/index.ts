import { SNSHeartbeatMessageHandler } from './sns-process';
import { SNSDataQueryHandler } from './get-data';

export = {
  'sns-process': SNSHeartbeatMessageHandler.handler,
  'get-data': SNSDataQueryHandler.handler,
};
