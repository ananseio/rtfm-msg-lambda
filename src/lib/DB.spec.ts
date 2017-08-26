import { DynamoDB } from 'aws-sdk';
import { DB } from './DB';
import { Settings } from '../settings';

describe('database', () => {
  let db: DB;
  beforeAll(() => {
    db = new DB();
  });

  it('should create new message', async () => {
    expect(await db.putMessage('db-test', 'test1')).toBe(true);
  });

  it('should not overwrite existing message', async () => {
    expect(await db.putMessage('db-test', 'test1')).toBe(false);
  });

  it('should get existing message', async () => {
    expect(await db.getMessage('db-test')).toBe('test1');
  });
});
