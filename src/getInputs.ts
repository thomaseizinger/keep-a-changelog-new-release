import formatDate from "./formatDate";
import { getInput } from "@actions/core/lib/core";

interface Inputs {
  version: string;
  date: string;
  owner: string;
  repo: string;
}

export default function getInputs(): Inputs {
  const version = getInput("version", { required: true });
  const dateInput = getInput("date");
  const date = formatDate(
    dateInput ? new Date(Date.parse(dateInput)) : new Date()
  );
  const githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error("GITHUB_REPOSITORY is not set");
  }

  const [owner, repo] = githubRepository.split("/");

  return {
    version,
    date,
    owner,
    repo
  };
}
