import { NextRequest, NextResponse } from "next/server";
import { readAndProcessMdx } from "@/lib/mdx-processor";
import { readFile } from "fs/promises";
import { join, normalize } from "path";

function isSafePath(root: string, relativePath: string): boolean {
  const full = normalize(join(root, relativePath));
  const normRoot = normalize(root);
  return full.startsWith(normRoot);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const format = searchParams.get("format") || "txt";

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    let content: string;
    let title: string;

    if (path.startsWith("src/")) {
      const srcRoot = process.cwd();
      if (!isSafePath(srcRoot, path)) {
        throw new Error("Invalid path");
      }
      const filePath = join(srcRoot, path);
      content = await readFile(filePath, "utf8");
      title = path.split("/").pop() || "file";
    } else {
      const stripFrontmatter = searchParams.get("stripFrontmatter");
      const stripHtmlComments = searchParams.get("stripHtmlComments");
      const stripModuleLines = searchParams.get("stripModuleLines");
      const cleanPath = path.startsWith("content/") ? path.slice(8) : path;
      const processed = await readAndProcessMdx(cleanPath, {
        stripFrontmatter: stripFrontmatter !== "0",
        stripHtmlComments: stripHtmlComments !== "0",
        stripModuleLines: stripModuleLines !== "0",
      });
      content = processed.content;
      title = processed.title;
    }

    if (format === "json") {
      return NextResponse.json({
        title: title,
        content: content,
      });
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (e) {
    console.error(`Error in raw-mdx API (path: ${path}):`, e);
    const errorMessage = e instanceof Error ? e.message : "Not found or invalid path";
    return NextResponse.json({ error: errorMessage }, { status: 404 });
  }
}
