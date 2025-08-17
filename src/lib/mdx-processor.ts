import { readFile } from "fs/promises";
import matter from "gray-matter";
import { join, normalize } from "path";

export type TProcessOptions = {
  stripFrontmatter?: boolean;
  stripHtmlComments?: boolean;
  stripModuleLines?: boolean;
};

export type TProcessedMdx = {
  content: string;
  title: string;
};

export function isSafeContentPath(contentRoot: string, relativePath: string): boolean {
  const full = normalize(join(contentRoot, relativePath));
  const root = normalize(contentRoot);
  return full.startsWith(root);
}

export async function readAndProcessMdx(relativePath: string, options?: TProcessOptions): Promise<TProcessedMdx> {
  const contentRoot = join(process.cwd(), "content");
  if (!isSafeContentPath(contentRoot, relativePath)) {
    throw new Error("Invalid path");
  }
  const filePath = join(contentRoot, relativePath);
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  const title = typeof parsed.data?.title === "string" ? parsed.data.title : "document";
  let body = options?.stripFrontmatter === false ? raw : parsed.content;
  if (options?.stripHtmlComments !== false) {
    body = body.replace(/<!--([\s\S]*?)-->/g, "");
  }
  if (options?.stripModuleLines !== false) {
    body = body
      .split("\n")
      .filter((line) => !/^\s*(import\s|export\s)/.test(line))
      .join("\n");
  }
  return { content: body.trim() + "\n", title };
}
