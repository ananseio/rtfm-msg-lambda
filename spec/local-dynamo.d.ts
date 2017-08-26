declare module 'local-dynamo' {
  import { ChildProcess } from 'child_process';

  interface Options {
    dir: string | null;
    port: number;
    heap: string;
  }

  function launch(dir: string | null, port: number): ChildProcess;
  export function launch(options: Options): ChildProcess;
}
