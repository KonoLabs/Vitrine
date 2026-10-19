import { error } from "@sveltejs/kit";

const posts = import.meta.glob("../../../posts/*.md");

export async function load({ params }) {
  if (!params.slug) {
    throw error(404, `No slug provided`);
  }
  
  const postPath = `../../../posts/${params.slug}.md`;
  
  if (!posts[postPath]) {
    throw error(404, `Could not find ${params.slug}`);
  }
  
  try {
    const post = await posts[postPath]();

    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    console.error(`Failed to load post: ${params.slug}`, e);
    throw error(404, `Could not find ${params.slug}`);
  }
}
