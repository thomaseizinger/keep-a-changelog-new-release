import { setFailed } from "@actions/core";
import { read, write } from "to-vfile";
import updateChangelog from "./updateChangelog";
import getInputs from "./getInputs";
import getGenesisHash from "./getGenesisHash";

async function run(): Promise<void> {
  try {
    const { tag, version, date, owner, repo, changelogPath } = getInputs();

    const genesisHash = await getGenesisHash();
    const changelog = await read(changelogPath, { encoding: "utf-8" });

    const newChangelog = await updateChangelog(
      changelog,
      tag,
      version,
      date,
      genesisHash,
      owner,
      repo
    );

    await write(newChangelog, { encoding: "utf-8" });
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed(`${error}`);
    }
  }
}

run();
