import { SNSHeartbeatMessageHandler } from './sns-process';
import { SNSDataQueryHandler } from './api/get-data';

export = {
  'sns-process': SNSHeartbeatMessageHandler.handler,
  'get-data': SNSDataQueryHandler.handler,
};
