import { morph } from "mock-env";
import getInputs from "../src/getInputs";

test("version is required", function() {
  expect(() => morph(getInputs, { GITHUB_REPOSITORY: "foo/bar" })).toThrow();
});

test("date is optional but has a default", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    GITHUB_REPOSITORY: "foo/bar"
  });

  expect(inputs).toHaveProperty("version", "0.6.0");
  expect(inputs).toHaveProperty("date");
});

test("parses date into ISO8601", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    INPUT_DATE: "Dec 09 2019"
  });

  expect(inputs).toHaveProperty("date", "2019-12-09");
});

test("parses GITHUB_REPOSITORY into owner and repo", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    GITHUB_REPOSITORY: "foo/bar"
  });

  expect(inputs).toHaveProperty("owner", "foo");
  expect(inputs).toHaveProperty("repo", "bar");
});

test("can handle ISO8601 date", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    INPUT_DATE: "2019-12-09"
  });

  expect(inputs).toHaveProperty("date", "2019-12-09");
});

test("changelog path is optional but has a default", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    GITHUB_REPOSITORY: "foo/bar"
  });

  expect(inputs).toHaveProperty("changelogPath", "./CHANGELOG.md");
});

test("parse changelog path from input", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    GITHUB_REPOSITORY: "foo/bar",
    INPUT_CHANGELOGPATH: "./foo/bar/CHANGELOG.md"
  });

  expect(inputs).toHaveProperty("changelogPath", "./foo/bar/CHANGELOG.md");
});
