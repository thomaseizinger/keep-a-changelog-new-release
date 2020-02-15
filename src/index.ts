import { setFailed } from "@actions/core";
import { read, write } from "to-vfile";
import updateChangelog from "./updateChangelog";
import getInputs from "./getInputs";
import getGenesisHash from "./getGenesisHash";

async function run(): Promise<void> {
  try {
    const { version, date, owner, repo } = getInputs();

    const genesisHash = await getGenesisHash();
    const changelog = await read("CHANGELOG.md", { encoding: "utf-8" });

    const newChangelog = await updateChangelog(
      changelog,
      version,
      date,
      genesisHash,
      owner,
      repo
    );

    await write(newChangelog, { encoding: "utf-8" });
  } catch (error) {
    setFailed(error.message);
  }
}

run();
