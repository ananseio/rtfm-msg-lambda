import { DefaultCategory } from '@ananseio/lib-secrets';
import { Secret, SecretConfig } from '@ananseio/lib-secrets/decorator';

// tslint:disable:no-stateless-class

/**
 *  Settings
 */
@SecretConfig()
export class Settings {
  @Secret('version', 'settings')
  public static version: Promise<string>;

  public static rtfmTimeSeriesTable = process.env.RTFM_TIMESERIES_TABLE!;
}
