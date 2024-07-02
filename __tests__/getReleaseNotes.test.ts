import getReleaseNotes from "../src/getReleaseNotes";
import { read } from "to-vfile";

interface Fixture {
  tag: string;
  version: string;
  date: string;
  genesisHash: string;
  owner: string;
  repo: string;
}

it.each(["empty_release", "standard", "first_release", "lowercase_link_reference", "tag_release", "tag_on_tag"])(
  `should extract %s release-notes output`,
  async function(testcase) {
    const expectedChangelog = await read(
      `./__tests__/fixtures/${testcase}/CHANGELOG.expected.md`,
      {
        encoding: "utf-8"
      }
    );
    const release: Fixture = await import(
      `./fixtures/${testcase}/fixture`
    ).then(module => module.default);

    const expectedReleaseNotes = await read(
      `./__tests__/fixtures/${testcase}/release-notes.expected.md`,
      {
        encoding: "utf-8"
      }
    ).then(expected => expected.toString("utf-8"));
    const actualReleaseNotes = getReleaseNotes(expectedChangelog, release.version);
    expect(actualReleaseNotes).toEqual(expectedReleaseNotes);
  }
);
