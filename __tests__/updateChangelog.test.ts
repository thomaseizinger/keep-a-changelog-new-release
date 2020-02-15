import updateChangelog from "../src/updateChangelog";
import { read } from "to-vfile";

it("should update the changelog correctly", async function() {
  const before = await read("./__tests__/fixtures/CHANGELOG.1.md", {
    encoding: "utf-8"
  });
  const expected = await read("./__tests__/fixtures/CHANGELOG.1.expected.md", {
    encoding: "utf-8"
  });

  const actual = await updateChangelog(before, "0.3.0", "2019-12-06");

  const actualContent = actual.toString("utf-8");
  const expectedContent = expected.toString("utf-8");

  expect(actualContent).toEqual(expectedContent);
});
