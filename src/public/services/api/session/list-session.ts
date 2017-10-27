// import { FuncDef, HTTP } from '@ananseio/serverless-common';
// import { Service, Session } from '../../../types';

// /**
//  *
//  */
// export const ListSession = {
//   Service,
//   Function: 'list-session'
// } as FuncDef<ListSession.Request, HTTP.Response<ListSession.Response>>;

// export namespace ListSession {
//   export interface Request extends HTTP.Event<{}> {
//   }

//   export interface NormalResponse {
//     status: string;
//     sessions: Session[];
//   }

//   export interface ErrorResponse {
//     error: string;
//   }

//   export type Response = NormalResponse | ErrorResponse;
// }
