import { readFile } from "node:fs/promises";

export const runtime = "nodejs";

const HTML_PATH =
  "C:\\Users\\itzar\\Downloads\\cnx_final (1).html";

export async function GET() {
  try {
    const html = await readFile(HTML_PATH, "utf-8");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Prevent caching while you iterate locally
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(
      `Failed to load HTML file from server path: ${HTML_PATH}`,
      { status: 500 }
    );
  }
}

