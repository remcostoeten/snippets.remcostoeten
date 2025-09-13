import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import matter from "gray-matter";
import { FindReplaceGenerator } from "@/components/find-and-replace-generator";
import { CopyLLMVersion } from "@/components/core/copy-llm-version";
import React, { useMemo } from "react";
import { CodeBlock } from "@/components/code-block";

import {
    PostMetadata,
} from "ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";

const SmallText = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className="text-xs text-muted-foreground flex items-center gap-2"
    {...props}
  >

    <span className="text-sm animate-pulse">💡 </span>{children}
  </div>
);

// Tooltip component for MDX
const MDXTooltip = ({ 
  children, 
  content, 
  ...props 
}: { 
  children: React.ReactNode; 
  content: string; 
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted cursor-help" {...props}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Tab,
    Tabs,
    FindReplaceGenerator,
    CopyLLMVersion,
    SmallText,
    CodeBlock,
    MDXTooltip,
    wrapper: React.memo(({ children }) => {
      const content = children?.toString() || "";
      
      // Memoize expensive calculations
      const { frontmatter, readingTime } = useMemo(() => {
        const { data: frontmatter, content: mdxContent } = matter(content);
        const wordCount = mdxContent.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        return { frontmatter, readingTime };
      }, [content]);
      
      return (
        <div>
          <PostMetadata
            date={frontmatter.lastModified || new Date().toISOString()}
          />
          {children}
        </div>
      );
    }),
  };
}
