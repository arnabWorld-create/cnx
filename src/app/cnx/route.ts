import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

// Serve the HTML from the repo (works on Vercel).
const PUBLIC_HTML_PATH = path.join(process.cwd(), "public", "cnx-healthcare.html");

// Local-only fallback (your current full file).
const LOCAL_FALLBACK_HTML_PATH =
  "C:\\Users\\itzar\\Downloads\\cnx_final (1).html";

async function readHtmlFrom(filePath: string) {
  const html = await readFile(filePath, "utf-8");
  return html;
}

export async function GET() {
  // Try repo HTML first (the one that should be committed to Git).
  try {
    const repoStat = await stat(PUBLIC_HTML_PATH);
    if (repoStat.size >= 50000) {
      const html = await readHtmlFrom(PUBLIC_HTML_PATH);
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
  } catch {
    // ignore; we'll attempt the local fallback in dev
  }

  // If repo HTML is missing/truncated, fall back to Downloads in dev only.
  if (process.env.NODE_ENV !== "production") {
    const html = await readHtmlFrom(LOCAL_FALLBACK_HTML_PATH);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(
    "CNX HTML not found in repo. Please ensure `public/cnx-healthcare.html` contains the full HTML before deploying.",
    { status: 500 }
  );
}

