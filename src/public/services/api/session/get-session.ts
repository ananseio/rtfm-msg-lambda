// import { FuncDef, HTTP } from '@ananseio/serverless-common';
// import { Service, Session } from '../../../types';

// /**
//  *
//  */
// export const GetSession = {
//   Service,
//   Function: 'get-session'
// } as FuncDef<GetSession.Request, HTTP.Response<GetSession.Response>>;

// export namespace GetSession {
//   export interface Request extends HTTP.Event<{}> {
//     parameters: {
//       sessionUuid: string;
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
