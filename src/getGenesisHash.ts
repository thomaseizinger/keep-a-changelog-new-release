import { exec } from "@actions/exec";
import { WritableStreamBuffer } from "stream-buffers";

export default async function getGenesisHash(): Promise<string> {
  const outStream = new WritableStreamBuffer();

  const exitCode = await exec("git", ["rev-list", "--max-parents=0", "HEAD"], {
    outStream,
  });

  if (exitCode !== 0) {
    throw new Error("git returned exit code != 0");
  }

  const genesisHash = outStream.getContentsAsString("utf-8");

  if (!genesisHash) {
    throw new Error("unable to parse genesis hash from git");
  }

  const lines = genesisHash.split("\n");

  return lines[1];
}
