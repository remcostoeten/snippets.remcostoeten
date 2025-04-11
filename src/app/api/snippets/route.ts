import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";

const SNIPPETS_DIR = join(process.cwd(), "src/content/docs");

export async function GET() {
  try {
    const files = await readdir(SNIPPETS_DIR, { recursive: true });
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const snippets = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = join(SNIPPETS_DIR, file);
        const content = await readFile(filePath, "utf-8");
        const { data: frontmatter } = matter(content);

        return {
          title:
            frontmatter.title || file.split("/").pop()?.replace(".mdx", ""),
          description: frontmatter.description || "",
          href: `/docs/${file.replace(".mdx", "")}`,
          language: frontmatter.language || "Unknown",
          languageColor: getLanguageColor(frontmatter.language),
          lastModified: frontmatter.lastModified || new Date().toISOString(),
        };
      })
    );

    // Sort by lastModified date, most recent first
    const sortedSnippets = snippets.sort(
      (a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    // Return only the 5 most recent snippets
    return NextResponse.json(sortedSnippets.slice(0, 5));
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
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
