import { getInput, setFailed } from "@actions/core";
import { read, write } from "to-vfile";
import updateChangelog from "./updateChangelog";
import formatDate from "./formatDate";

async function run(): Promise<void> {
  try {
    const version = getInput("version");
    const today = formatDate(new Date());
    const changelog = await read("CHANGELOG.md", { encoding: "utf-8" });

    const newChangelog = await updateChangelog(changelog, version, today);

    await write(newChangelog, { encoding: "utf-8" });
  } catch (error) {
    setFailed(error.message);
  }
}

run();
