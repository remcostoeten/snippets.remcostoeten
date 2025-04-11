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
    identifiers: ["git", "gitignore"],
  },
};

// Language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-400",
  Python: "bg-green-400",
  Shell: "bg-gray-400",
  JSON: "bg-purple-400",
  CSS: "bg-pink-400",
  HTML: "bg-orange-400",
  Databases: "bg-indigo-400",
  Git: "bg-red-400",
  Unknown: "bg-zinc-400",
};

function detectLanguage(content: string): string {
  // Look for code blocks with language identifiers
  const codeBlockRegex = /```(\w+)/g;
  const matches = Array.from(content.matchAll(codeBlockRegex));

  // Count occurrences of each language
  const languageCounts = new Map<string, number>();

  for (const match of matches) {
    const identifier = match[1].toLowerCase();

    // Find which language this identifier belongs to
    for (const [lang, { identifiers }] of Object.entries(LANGUAGE_PATTERNS)) {
      if (identifiers.includes(identifier)) {
        languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
      }
    }
  }

  // Return the most common language, or 'Unknown' if none found
  if (languageCounts.size === 0) {
    return "Unknown";
  }

  return Array.from(languageCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
}

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

        // Map the language from frontmatter to our categories
        const language = mapLanguage(frontmatter.language || "Unknown");

        return {
          title:
            frontmatter.title || file.split("/").pop()?.replace(".mdx", ""),
          description: frontmatter.description || "",
          href: page.url,
          language,
          languageColor:
            LANGUAGE_COLORS[language] || LANGUAGE_COLORS["Unknown"],
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
