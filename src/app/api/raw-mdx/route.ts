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
    const processed = await readAndProcessMdx(path, {
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
    return NextResponse.json({ error: "Not found or invalid path" }, { status: 404 });
  }
}
