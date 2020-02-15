import updateChangelog from "../src/updateChangelog";
import { read } from "to-vfile";

interface Fixture {
  version: string;
  date: string;
}

it.each(["empty_release", "standard"])(
  `should update %s changelog`,
  async function(testcase) {
    const before = await read(`./__tests__/fixtures/${testcase}/CHANGELOG.md`, {
      encoding: "utf-8"
    });
    const expected = await read(
      `./__tests__/fixtures/${testcase}/CHANGELOG.expected.md`,
      {
        encoding: "utf-8"
      }
    );
    const release: Fixture = await import(
      `./fixtures/${testcase}/fixture`
    ).then(module => module.default);

    const actual = await updateChangelog(before, release.version, release.date);

    const actualContent = actual.toString("utf-8");
    const expectedContent = expected.toString("utf-8");

    expect(actualContent).toEqual(expectedContent);
  }
);
