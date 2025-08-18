import { NextRequest, NextResponse } from "next/server";
import { readAndProcessMdx } from "@/lib/mdx-processor";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const format = searchParams.get("format") || "txt";
  const stripFrontmatter = searchParams.get("stripFrontmatter");
  const stripHtmlComments = searchParams.get("stripHtmlComments");
  const stripModuleLines = searchParams.get("stripModuleLines");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    // Remove 'content/' prefix if present since readAndProcessMdx expects relative path from content dir
    const cleanPath = path.startsWith('content/') ? path.slice(8) : path;
    
    const processed = await readAndProcessMdx(cleanPath, {
      stripFrontmatter: stripFrontmatter !== "0",
      stripHtmlComments: stripHtmlComments !== "0",
      stripModuleLines: stripModuleLines !== "0",
    });

    if (format === "json") {
      return NextResponse.json({
        title: processed.title,
        content: processed.content,
      });
    }

    return new NextResponse(processed.content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (e) {
    console.error('Error in raw-mdx API:', e);
    const errorMessage = e instanceof Error ? e.message : "Not found or invalid path";
    return NextResponse.json({ error: errorMessage }, { status: 404 });
  }
}
