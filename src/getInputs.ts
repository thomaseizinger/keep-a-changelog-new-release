import formatDate from "./formatDate";
import { getInput, warning } from "@actions/core/lib/core";

interface Inputs {
  tag: string;
  version: string;
  date: string;
  owner: string;
  repo: string;
  changelogPath: string;
}

function parseTagAndVersion(): [string, string] {
  const tagInput = getInput("tag");
  if (tagInput) {
    const version = tagInput.startsWith("v") ? tagInput.substring(1) : tagInput;
    return [tagInput, version];
  } else {
    const versionInput = getInput("version");

    if (!versionInput) {
      throw new Error("Neither version nor tag specified");
    }

    warning("Version argument will be deprecated soon, use tag instead.");
    return [versionInput, versionInput];
  }
}

export default function getInputs(): Inputs {
  const [tag, version] = parseTagAndVersion();

  const dateInput = getInput("date");
  const date = formatDate(
    dateInput ? new Date(Date.parse(dateInput)) : new Date()
  );
  const changelogPath = getInput("changelogPath") || "./CHANGELOG.md";
  const githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error("GITHUB_REPOSITORY is not set");
  }

  const [owner, repo] = githubRepository.split("/");

  return {
    tag,
    version,
    date,
    owner,
    repo,
    changelogPath,
  };
}
