import unified, { Transformer } from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { VFile } from "vfile";
import { Node, Position } from "unist";

type MarkdownRootNode = {
  type: "root";
  children: MarkdownNode[];
};

interface HeadingNode {
  type: "heading";
  depth: number;
  children: MarkdownNode[];
  position: Position;
}

interface DefinitionNode {
  type: "definition";
  identifier: string;
  label: string;
  url: string;
  position?: Position;
}

interface ListNode {
  type: "list";
  ordered: boolean;
  start: any;
  spread: boolean;
  url: string;
  children: object[];
  position: Position;
}

interface ParagraphNode {
  type: "paragraph";
  children: object[];
  position: Position;
}

interface LinkReferenceNode {
  type: "linkReference";
  identifier: string;
  label: string;
  referenceType: string;
  children: TextNode[];
  position?: Position;
}

interface TextNode {
  type: "text";
  value: string;
  position?: Position;
}

type MarkdownNode =
  | HeadingNode
  | DefinitionNode
  | ListNode
  | ParagraphNode
  | LinkReferenceNode
  | TextNode;

interface Options {
  version: string;
  releaseDate: string;
  genesisHash: string;
  owner: string;
  repo: string;
}

function releaseTransformation({
  version,
  releaseDate,
  genesisHash,
  owner,
  repo
}: Options) {
  return transformer as Transformer;

  function transformer(tree: MarkdownRootNode, _file: VFile) {
    const previousVersion = determinePreviousVersion(tree);
    convertUnreleasedSectionToNewRelease(tree, version, releaseDate);
    addEmptyUnreleasedSection(tree);
    updateCompareUrls(tree, version, previousVersion, genesisHash, owner, repo);

    return tree as Node;
  }
}

function determinePreviousVersion(tree: MarkdownRootNode): string | null {
  const children = tree.children;

  const versions = children.filter(
    node => node.type === "heading" && node.depth === 2
  );

  const previousRelease = versions[1] as HeadingNode | undefined;

  if (!previousRelease) {
    return null;
  }

  const linkReference = previousRelease.children[0];

  if (!linkReference || linkReference.type !== "linkReference") {
    throw new Error(
      "Invalid changelog format, previous version is not a link reference"
    );
  }

  const linkReferenceTextNode = linkReference.children[0];

  if (!linkReferenceTextNode) {
    throw new Error(
      "Invalid changelog format, link reference does not have a text"
    );
  }

  return linkReferenceTextNode.value;
}

function convertUnreleasedSectionToNewRelease(
  tree: MarkdownRootNode,
  version: string,
  releaseDate: string
) {
  const children = tree.children;

  // the unreleased section should always be at the top
  const unreleasedSection = children.find(
    node => node.type === "heading" && node.depth === 2
  ) as HeadingNode | undefined;

  if (!unreleasedSection) {
    throw new Error(
      "Invalid changelog format, could not find Unreleased section"
    );
  }

  const child = unreleasedSection.children.shift();

  if (
    !child ||
    unreleasedSection.children.length > 0 ||
    child.type !== "linkReference"
  ) {
    throw new Error(
      "Invalid changelog format, Unreleased section should only be a link reference"
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
          value: version
        }
      ]
    },
    {
      type: "text",
      value
    }
  ];

  unreleasedSection.children = newReleaseSection;
}

function addEmptyUnreleasedSection(tree: MarkdownRootNode) {
  const children = tree.children;

  const firstHeadingSectionIndex = children.findIndex(
    node => node.type === "heading" && node.depth === 2
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
              value: "Unreleased"
            }
          ]
        }
      ]
    },
    ...afterFirstHeading
  ];
}

function updateCompareUrls(
  tree: MarkdownRootNode,
  newVersion: string,
  previousVersion: string | null,
  genesisHash: string,
  owner: string,
  repo: string
) {
  const children = tree.children;

  const unreleasedDefinitionIndex = children.findIndex(
    node => node.type === "definition" && node.identifier === "unreleased"
  );

  const before =
    unreleasedDefinitionIndex !== -1
      ? children.slice(0, unreleasedDefinitionIndex)
      : children;
  const after =
    unreleasedDefinitionIndex !== -1
      ? children.slice(unreleasedDefinitionIndex + 1)
      : [];

  const unreleasedCompareUrl = `https://github.com/${owner}/${repo}/compare/${newVersion}...HEAD`;
  const previousVersionCompareUrl = previousVersion
    ? `https://github.com/${owner}/${repo}/compare/${previousVersion}...${newVersion}`
    : `https://github.com/${owner}/${repo}/compare/${genesisHash}...${newVersion}`;

  tree.children = [
    ...before,
    {
      type: "definition",
      identifier: "unreleased",
      url: unreleasedCompareUrl,
      label: "Unreleased"
    },
    {
      type: "definition",
      identifier: newVersion,
      url: previousVersionCompareUrl,
      label: newVersion
    },
    ...after
  ];
}

export default async function updateChangelog(
  file: VFile,
  version: string,
  releaseDate: string,
  genesisHash: string,
  owner: string,
  repo: string
): Promise<VFile> {
  return await unified()
    .use(markdown)
    .use(releaseTransformation, {
      version,
      releaseDate,
      genesisHash,
      owner,
      repo
    })
    .use(stringify)
    .process(file);
}
