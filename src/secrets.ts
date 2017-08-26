import { DefaultCategory } from '@ananseio/lib-secrets';
import { Secret, SecretConfig } from '@ananseio/lib-secrets/decorator';

// tslint:disable:no-stateless-class

/**
 *  Secrets
 */
@SecretConfig()
export class Secrets {
  @Secret('key')
  public static key: Promise<string>;
}
