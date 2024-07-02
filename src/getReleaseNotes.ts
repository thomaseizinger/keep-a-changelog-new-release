import unified, { Transformer } from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { VFile } from "vfile";
import { Node } from "unist";
import { MarkdownRootNode } from "markdown-nodes";

function releaseNotesExtraction(version: string) {
  return transformer as unknown as Transformer;

  function transformer(tree: MarkdownRootNode, _file: VFile) {
    const children = tree.children;

    const firstNodeIndex = children.findIndex(
      node => node.type === "heading" && node.depth === 2 &&
        node.children.length > 1 && node.children[0].type === "linkReference" &&
        node.children[0].identifier === version
    ) + 1;
    const firstNode = children.slice(firstNodeIndex);

    let lastNodeIndex = firstNode.findIndex(
      node => node.type === "heading" && node.depth === 2
    );
    // special case: release notes for first release will not end with another
    // section, instead they end with the compare URLs
    if (lastNodeIndex === -1) {
      lastNodeIndex = firstNode.findIndex(
        node => node.type === "definition" && node.identifier === "unreleased"
      );
    }
  
    const releaseNotesNodes = firstNode.slice(0, lastNodeIndex);
    tree.children = releaseNotesNodes;
    return tree as Node;
  }
}

export default function getReleaseNotes(
  file: VFile,
  version: string
): string {
  // @ts-ignore
  return unified()
    .use(markdown)
    .use(releaseNotesExtraction, version)
    .data("settings", {
      listItemIndent: "1",
      tightDefinitions: true,
      bullet: "-"
    })
    .use(stringify)
    .processSync(file)
    .toString("utf-8")
    .trim();
}
