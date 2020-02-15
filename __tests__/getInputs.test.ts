import { morph } from "mock-env";
import getInputs from "../src/getInputs";

test("version is required", function() {
  expect(() => morph(getInputs, {})).toThrow();
});

test("date is optional but has a default", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0"
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

test("can handle ISO8601 date", function() {
  const inputs = morph(getInputs, {
    INPUT_VERSION: "0.6.0",
    INPUT_DATE: "2019-12-09"
  });

  expect(inputs).toHaveProperty("date", "2019-12-09");
});
