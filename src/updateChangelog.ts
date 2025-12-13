import { unified, Transformer } from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { VFile } from "vfile";
import { Node, Position } from "unist";
import {
  MarkdownRootNode,
  HeadingNode,
  DefinitionNode,
  LinkReferenceNode,
  TextNode,
} from "markdown-nodes";

interface Options {
  tag: string;
  version: string;
  releaseDate: string;
  genesisHash: string;
  owner: string;
  repo: string;
}

function releaseTransformation({
  tag,
  version,
  releaseDate,
  genesisHash,
  owner,
  repo,
}: Options) {
  return transformer as unknown as Transformer;

  function transformer(tree: MarkdownRootNode, _file: VFile) {
    convertUnreleasedSectionToNewRelease(tree, version, releaseDate);
    addEmptyUnreleasedSection(tree);

    const previousVersion = determinePreviousVersion(tree);
    updateCompareUrls(
      tree,
      tag,
      version,
      previousVersion,
      genesisHash,
      owner,
      repo,
    );

    return tree as Node;
  }
}

function determinePreviousVersion(tree: MarkdownRootNode): string | null {
  const children = tree.children;

  const versions = children.filter((node) => node.type === "definition");

  const previousRelease = versions[1] as DefinitionNode | undefined;

  if (!previousRelease) {
    return null;
  }

  const link = previousRelease.url;
  const split = link.split("...");

  if (split.length !== 2) {
    throw new Error("Invalid changelog format, compare url is not standard");
  }

  return split[1];
}

function convertUnreleasedSectionToNewRelease(
  tree: MarkdownRootNode,
  version: string,
  releaseDate: string,
) {
  const children = tree.children;

  // the unreleased section should always be at the top
  const unreleasedSection = children.find(
    (node) => node.type === "heading" && node.depth === 2,
  ) as HeadingNode | undefined;

  if (!unreleasedSection) {
    throw new Error(
      "Invalid changelog format, could not find Unreleased section",
    );
  }

  const child = unreleasedSection.children.shift();

  // remark parses shorcut links as "text" if it can't locate the footer link, which is the case for the first release test case
  if (
    !child ||
    unreleasedSection.children.length > 0 ||
    (child.type !== "linkReference" && child.type !== "text")
  ) {
    throw new Error(
      "Invalid changelog format, Unreleased section should only be a link reference",
    );
  }

  const value = ` - ${releaseDate}`;

  const newReleaseSection: [LinkReferenceNode, TextNode] = [
    {
      type: "linkReference",
      identifier: version,
      label: version,
      referenceType: "shortcut",
      position: child.position,
      children: [
        {
          type: "text",
          value: version,
        },
      ],
    },
    {
      type: "text",
      value,
    },
  ];

  unreleasedSection.children = newReleaseSection;
}

function addEmptyUnreleasedSection(tree: MarkdownRootNode) {
  const children = tree.children;

  const firstHeadingSectionIndex = children.findIndex(
    (node) => node.type === "heading" && node.depth === 2,
  );

  const beforeFirstHeading = children.slice(0, firstHeadingSectionIndex);
  const afterFirstHeading = children.slice(firstHeadingSectionIndex);

  tree.children = [
    ...beforeFirstHeading,
    {
      type: "heading",
      depth: 2,
      position: {} as Position,
      children: [
        {
          type: "linkReference",
          identifier: "unreleased",
          label: "Unreleased",
          referenceType: "shortcut",
          children: [
            {
              type: "text",
              value: "Unreleased",
            },
          ],
        },
      ],
    },
    ...afterFirstHeading,
  ];
}

function updateCompareUrls(
  tree: MarkdownRootNode,
  newTag: string,
  newVersion: string,
  previousTag: string | null,
  genesisHash: string,
  owner: string,
  repo: string,
) {
  const children = tree.children;

  const unreleasedDefinitionIndex = children.findIndex(
    (node) => node.type === "definition" && node.identifier === "unreleased",
  );

  const before =
    unreleasedDefinitionIndex !== -1
      ? children.slice(0, unreleasedDefinitionIndex)
      : children;
  const after =
    unreleasedDefinitionIndex !== -1
      ? children.slice(unreleasedDefinitionIndex + 1)
      : [];

  const unreleasedCompareUrl = `https://github.com/${owner}/${repo}/compare/${newTag}...HEAD`;
  const previousVersionCompareUrl = previousTag
    ? `https://github.com/${owner}/${repo}/compare/${previousTag}...${newTag}`
    : `https://github.com/${owner}/${repo}/compare/${genesisHash}...${newTag}`;

  tree.children = [
    ...before,
    {
      type: "definition",
      identifier: "unreleased",
      url: unreleasedCompareUrl,
      label: "unreleased",
    },
    {
      type: "definition",
      identifier: newVersion,
      url: previousVersionCompareUrl,
      label: newVersion,
    },
    ...after,
  ];
}

export default async function updateChangelog(
  file: VFile,
  tag: string,
  version: string,
  releaseDate: string,
  genesisHash: string,
  owner: string,
  repo: string,
): Promise<VFile> {
  return await unified()
    .use(markdown)
    .use(releaseTransformation, {
      tag,
      version,
      releaseDate,
      genesisHash,
      owner,
      repo,
    })
    .data("settings", {
      listItemIndent: "one",
      tightDefinitions: true,
      bullet: "-",
    })
    .use(stringify)
    .process(file);
}
