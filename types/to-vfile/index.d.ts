declare module 'to-vfile' {
  import {VFile} from "vfile";

  interface Options {
    encoding: string
  }

  function read(path: string, options: Options): Promise<VFile>;
  function write(file: VFile, options: Options): Promise<void>;
}
