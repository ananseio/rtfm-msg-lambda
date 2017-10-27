// import { FuncDef, HTTP } from '@ananseio/serverless-common';
// import { Service, Session } from '../../../types';

// /**
//  * If you supply deviceUuid & profileUuid & startTime together, then it delete that record. Response will contain the session.
//  * If you supply a empty body, then it delete the whole session. Response will NOT contain the session.
//  */
// export const DeleteSession = {
//   Service,
//   Function: 'delete-session'
// } as FuncDef<DeleteSession.Request, HTTP.Response<DeleteSession.Response>>;

// export namespace DeleteSession {
//   export interface Request extends HTTP.Event<{}> {
//     parameters: {
//       sessionUuid: string;
//     }
//     body: {
//       deviceUuid?: string;
//       profileUuid?: string;
//       startTime?: number;
//     }
//   }

//   export interface NormalResponse {
//     status: string;
//     session?: Session;
//   }

//   export interface ErrorResponse {
//     error: string;
//   }

//   export type Response = NormalResponse | ErrorResponse;
// }
