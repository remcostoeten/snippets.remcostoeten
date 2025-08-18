import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import matter from "gray-matter";
import { FindReplaceGenerator } from "@/components/find-and-replace-generator";
import { CopyLLMVersion } from "@/components/core/copy-llm-version";

import {
    PostMetadata,
} from "ui";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Tab,
    Tabs,
    FindReplaceGenerator,
    CopyLLMVersion,
    wrapper: ({ children }) => {
      const content = children?.toString() || "";
      const { data: frontmatter, content: mdxContent } = matter(content);
      const wordCount = mdxContent.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      return (
        <div>
          <PostMetadata
            date={frontmatter.lastModified || new Date().toISOString()}
          />
          {children}
        </div>
      );
    },
  };
}
