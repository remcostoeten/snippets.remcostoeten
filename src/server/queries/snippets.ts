"use server";

import { readdir, readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { source } from "@/lib/source";

// Update the path to match Fumadocs' expected location
const SNIPPETS_DIR = join(process.cwd(), "content/docs");

// Database-related languages that should be mapped to "Databases"
const DATABASE_LANGUAGES = [
  "sql",
  "sqlite",
  "psql",
  "postgres",
  "postgresql",
  "drizzle",
  "prisma",
  "turso",
  "orm",
  "drizzle-orm",
  "databases",
  "database",
  "drizzle-kit",
  "sqlite3",
  "better-sqlite3",
  "libsql",
  "turso",
  "turso-orm",
];

// Language detection patterns based on code block language identifiers
const LANGUAGE_PATTERNS: Record<string, { identifiers: string[] }> = {
  JavaScript: {
    identifiers: ["js", "javascript", "jsx"],
  },
  TypeScript: {
    identifiers: ["ts", "typescript", "tsx"],
  },
  Python: {
    identifiers: ["py", "python"],
  },
  Shell: {
    identifiers: ["sh", "bash", "zsh", "shell"],
  },
  JSON: {
    identifiers: ["json"],
  },
  CSS: {
    identifiers: ["css", "scss", "sass"],
  },
  HTML: {
    identifiers: ["html", "htm"],
  },
  Databases: {
    identifiers: [
      "sql",
      "sqlite",
      "psql",
      "postgres",
      "postgresql",
      "drizzle",
      "prisma",
      "turso",
    ],
  },
  Git: {
    identifiers: [
      "git",
      "gitignore",
      "git-set-upstream",
      "git-branch-diverged",
    ],
  },
  Blog: {
    identifiers: [
      "blog",
      "text-formatting",
      "documentation",
      "docs",
      "markdown",
      "mdx",
      "misc",
      "miscellaneous",
      "other",
      "rant",
      "random",
    ],
  },
};

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
  Databases:
    "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  JSON: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
  Shell:
    "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
  TypeScript:
    "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  CSS: "bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20",
  HTML: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  Python: "bg-sky-600/10 text-sky-400 border-sky-600/20 hover:bg-sky-600/20",
  Git: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  Blog: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
  Unknown:
    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
};

function mapLanguage(language: string): string {
  // Convert to lowercase for case-insensitive comparison
  const lang = language.toLowerCase();

  // Check if it's a database-related language
  if (DATABASE_LANGUAGES.includes(lang)) {
    return "Databases";
  }

  // Return the original language if it's in our colors map
  if (LANGUAGE_COLORS[language]) {
    return language;
  }

  return "Unknown";
}

export async function getCategories() {
  try {
    const files = await readdir(SNIPPETS_DIR, { recursive: true });
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    // Get all unique categories from snippets
    const categoryMap = new Map<
      string,
      { count: number; description: string }
    >();

    for (const file of mdxFiles) {
      const filePath = join(SNIPPETS_DIR, file);
      const content = await readFile(filePath, "utf-8");
      const { data: frontmatter } = matter(content);

      if (frontmatter.category) {
        const category = frontmatter.category;
        const current = categoryMap.get(category) || {
          count: 0,
          description: frontmatter.categoryDescription || "",
        };
        categoryMap.set(category, {
          count: current.count + 1,
          description:
            current.description || frontmatter.categoryDescription || "",
        });
      }
    }

    // Convert to array and sort by count
    const categories = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        description: data.description,
        count: data.count,
        href: `/docs/${name.toLowerCase().replace(/\s+/g, "-")}`,
      }))
      .sort((a, b) => b.count - a.count);

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

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
        const { data: frontmatter, content: mdxContent } = matter(content);
        console.log("Frontmatter for", file, ":", frontmatter);

        // Get the page from Fumadocs source to ensure the path is correct
        const page = source.getPage(file.replace(".mdx", "").split("/"));
        if (!page) {
          console.warn(`Page not found in Fumadocs source: ${file}`);
          return null;
        }

        // Map the language from frontmatter to our categories
        const language = mapLanguage(frontmatter.language || "Unknown");

        // Calculate content metrics
        const wordCount = mdxContent.trim().split(/\s+/).length;
        const codeBlocks = (mdxContent.match(/```[\s\S]*?```/g) || []).length;
        const estimatedReadTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute reading speed

        return {
          title:
            frontmatter.title || file.split("/").pop()?.replace(".mdx", ""),
          description: frontmatter.description || "",
          href: page.url,
          language,
          languageColor:
            LANGUAGE_COLORS[language] || LANGUAGE_COLORS["Unknown"],
          lastModified: frontmatter.lastModified || new Date().toISOString(),
          metrics: {
            wordCount,
            codeBlocks,
            estimatedReadTime,
          },
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

    // Get categories
    const categories = await getCategories();

    return {
      snippets: sortedSnippets.slice(0, 5),
      totalCount: totalSnippets,
      remainingCount: totalSnippets - 3,
      categories: categories.slice(0, 3), // Return top 3 categories
    };
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return {
      snippets: [],
      totalCount: 0,
      remainingCount: 0,
      categories: [],
    };
  }
}
