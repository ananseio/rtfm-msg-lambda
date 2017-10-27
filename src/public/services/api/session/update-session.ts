// import { FuncDef, HTTP } from '@ananseio/serverless-common';
// import { Service, Session } from '../../../types';

// /**
//  *
//  */
// export const UpdateSession = {
//   Service,
//   Function: 'update-session'
// } as FuncDef<UpdateSession.Request, HTTP.Response<UpdateSession.Response>>;

// export namespace UpdateSession {
//   export interface Request extends HTTP.Event<{}> {
//     parameters: {
//       sessionUuid: string;
//       action: 'start' | 'end';
//     }
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
