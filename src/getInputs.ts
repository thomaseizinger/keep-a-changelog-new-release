import formatDate from "./formatDate";
import { getInput } from "@actions/core/lib/core";

interface Inputs {
  version: string;
  date: string;
}

export default function getInputs(): Inputs {
  const version = getInput("version", { required: true });
  const dateInput = getInput("date");
  const date = formatDate(
    dateInput ? new Date(Date.parse(dateInput)) : new Date()
  );

  return {
    version,
    date
  };
}
