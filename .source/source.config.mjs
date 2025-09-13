// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config/zod-3";
import rehypePrettyCode from "rehype-pretty-code";
var docs = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            light: "github-light",
            dark: "one-dark-pro"
          }
        }
      ]
    ]
  }
});
export {
  source_config_default as default,
  docs
};
