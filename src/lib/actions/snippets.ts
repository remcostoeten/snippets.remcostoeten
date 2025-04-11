"use server";

import { readdir, readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { source } from "@/lib/source";

// Update the path to match Fumadocs' expected location
const SNIPPETS_DIR = join(process.cwd(), "content/docs");

export async function getRecentSnippets() {
  try {
    console.log("Reading snippets from:", SNIPPETS_DIR);
    const files = await readdir(SNIPPETS_DIR, { recursive: true });
    console.log("Found files:", files);

    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
    console.log("MDX files:", mdxFiles);

    const snippets = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = join(SNIPPETS_DIR, file);
        console.log("Reading file:", filePath);
        const content = await readFile(filePath, "utf-8");
        const { data: frontmatter } = matter(content);
        console.log("Frontmatter for", file, ":", frontmatter);

        // Get the page from Fumadocs source to ensure the path is correct
        const page = source.getPage(file.replace(".mdx", "").split("/"));
        if (!page) {
          console.warn(`Page not found in Fumadocs source: ${file}`);
          return null;
        }

        // Determine language based on file content or path
        let language = frontmatter.language;
        if (!language) {
          if (file.includes("attempt-to-make-OSX-decent")) {
            language = "Shell";
          } else if (file.includes("dev-setup")) {
            language = "JSON";
          } else {
            language = "Unknown";
          }
        }

        return {
          title:
            frontmatter.title || file.split("/").pop()?.replace(".mdx", ""),
          description: frontmatter.description || "",
          href: page.url,
          language,
          languageColor: getLanguageColor(language),
          lastModified: frontmatter.lastModified || new Date().toISOString(),
        };
      })
    );

    // Filter out null values and sort by lastModified date
    const validSnippets = snippets.filter(
      (snippet): snippet is NonNullable<typeof snippet> => snippet !== null
    );
    const sortedSnippets = validSnippets.sort(
      (a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    // Get the total number of snippets
    const totalSnippets = sortedSnippets.length;

    // Return only the 3 most recent snippets and the total count
    return {
      snippets: sortedSnippets.slice(0, 3),
      totalCount: totalSnippets,
      remainingCount: totalSnippets - 3,
    };
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return {
      snippets: [],
      totalCount: 0,
      remainingCount: 0,
    };
  }
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-400",
    Python: "bg-green-400",
    Shell: "bg-gray-400",
    JSON: "bg-purple-400",
    CSS: "bg-pink-400",
    HTML: "bg-orange-400",
    SQL: "bg-indigo-400",
    Unknown: "bg-zinc-400",
  };
  return colors[language] || colors["Unknown"];
}
