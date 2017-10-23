import { FuncDef } from '@ananseio/serverless-common';
import { Service } from '../types';

export interface SNSHeartbeatMessageEvent {
  Records: SNSMessageRecord[];
}

export interface SNSMessageRecord {
  EventVersion?: string;
  EventSubscriptionArn?: string;
  EventSource?: 'aws:sns';
  Sns?: SNSMessage;
}

export interface SNSMessage {
  Type?: string;
  TopicArn?: string;
  Message?: string;
}

/**
 * Lambda function definition
 */
export const SNSHeartbeatMessage = {
  Service,
  Function: 'sns-process'
} as FuncDef<SNSHeartbeatMessageEvent, void>;

