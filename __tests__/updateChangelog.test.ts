import updateChangelog from "../src/updateChangelog";
import { read, write } from "to-vfile";

interface Fixture {
  version: string;
  date: string;
  genesisHash: string;
  owner: string;
  repo: string;
}

it.each(["empty_release", "standard", "first_release"])(
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

    const actual = await updateChangelog(
      before,
      release.version,
      release.date,
      release.genesisHash,
      release.owner,
      release.repo
    );
    actual.path = `./__tests__/fixtures/${testcase}/CHANGELOG.actual.md`;
    await write(actual, {
      encoding: "utf-8"
    });

    const actualContent = actual.toString("utf-8");
    const expectedContent = expected.toString("utf-8");

    expect(actualContent).toEqual(expectedContent);
  }
);
