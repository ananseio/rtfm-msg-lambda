import { config, DynamoDB } from 'aws-sdk';
import { ChildProcess } from 'child_process';
import { launch } from 'local-dynamo';

let localDb: ChildProcess;

/* tslint:disable:no-http-string */
async function initDB() {
  localDb = launch(null, 4567);
  config.update({
    region: 'us-east-1',
    accessKeyId: 'access-key',
    secretAccessKey: 'secret',
    dynamodb: { endpoint: 'http://localhost:4567' }
  });

  const dbService = new DynamoDB();

  await dbService.createTable({
    TableName: 'rtfm-timeseries-data-test',
    AttributeDefinitions: [{
      AttributeName: 'id',
      AttributeType: 'S'
    }],
    KeySchema: [{
      AttributeName: 'id',
      KeyType: 'HASH'
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }).promise();
}

beforeAll(initDB, 100000);

afterAll(() => localDb.kill());
