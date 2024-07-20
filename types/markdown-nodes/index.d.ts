declare module "markdown-nodes" {
  import { Position } from "unist";

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
}
