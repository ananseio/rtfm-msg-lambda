import { DefaultCategory } from '@ananseio/lib-secrets';
import { mock } from '@ananseio/lib-secrets/mock';

// tslint:disable:no-http-string

mock({
  [DefaultCategory]: {
    key: 'secret'     // Secret variables
  },
  settings: {
    version: 'v1'     // Setting variables
  }
});

// Environment variables
process.env.ORIGIN = 'http://localhost:3000';
process.env.RTFM_TIMESERIES_TABLE = 'rtfm-timeseries-data-test';
