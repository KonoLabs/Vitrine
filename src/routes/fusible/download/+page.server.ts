import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=3600" });
  try {
    const res = await fetch(
      "https://api.github.com/repos/KonoLabs/Fusible/releases/latest",
      { headers: { accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return { version: null, url: null };
    const data = await res.json();
    const tag = typeof data.tag_name === "string" ? data.tag_name : null;
    const url = typeof data.html_url === "string" ? data.html_url : null;
    return { version: tag ? tag.replace(/^v/, "") : null, url };
  } catch {
    return { version: null, url: null };
  }
};
