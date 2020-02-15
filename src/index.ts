import { setFailed } from "@actions/core";
import { read, write } from "to-vfile";
import updateChangelog from "./updateChangelog";
import getInputs from "./getInputs";

async function run(): Promise<void> {
  try {
    const { version, date } = getInputs();
    const changelog = await read("CHANGELOG.md", { encoding: "utf-8" });

    const newChangelog = await updateChangelog(changelog, version, date);

    await write(newChangelog, { encoding: "utf-8" });
  } catch (error) {
    setFailed(error.message);
  }
}

run();
