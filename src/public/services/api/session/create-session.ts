// import { FuncDef, HTTP } from '@ananseio/serverless-common';
// import { Service, Session } from '../../../types';

// /**
//  *
//  */
// export const CreateSession = {
//   Service,
//   Function: 'create-session'
// } as FuncDef<CreateSession.Request, HTTP.Response<CreateSession.Response>>;

// export namespace CreateSession {
//   export interface Request extends HTTP.Event<{}> {
//     body: {
//       deviceUuid: string;
//       profileUuid: string;
//       name?: string;
//       description?: string;
//     }
//   }

//   export interface NormalResponse {
//     status: string;
//     session: Session;
//   }

//   export interface ErrorResponse {
//     error: string;
//   }

//   export type Response = NormalResponse | ErrorResponse;
// }
