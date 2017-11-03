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
  public static rtfmCognitoUserPool = process.env.RTFM_COGNITO_USER_POOL_ID!;
  public static rtfmIotArn = process.env.RTFM_IOT_ARN!;
  public static emailSender = process.env.EMAIL_SENDER!;
}
