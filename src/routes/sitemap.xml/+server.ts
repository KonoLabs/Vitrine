import type { RequestHandler } from "./$types";

const pages = ["/", "/fusible", "/fusible/download", "/fieldcam", "/projects", "/blog"];

const posts = import.meta.glob<{ date?: string }>("../../posts/*.md", {
  eager: true,
  import: "metadata",
});

const entry = (loc: string, lastmod?: string) =>
  `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;

export const GET: RequestHandler = ({ url }) => {
  const articles = Object.entries(posts).map(([file, meta]) => {
    const slug = file.split("/").pop()!.replace(/\.md$/, "");
    const date = meta?.date ? new Date(meta.date) : undefined;
    return entry(
      `${url.origin}/blog/${slug}`,
      date && !Number.isNaN(date.getTime())
        ? date.toISOString().slice(0, 10)
        : undefined,
    );
  });
  const body = [...pages.map((path) => entry(url.origin + path)), ...articles];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body.join("\n")}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
};
