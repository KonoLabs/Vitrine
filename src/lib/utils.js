export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function loadBlogPosts() {
  const modules = import.meta.glob("/src/posts/*.md");
  const posts = [];

  for (const path in modules) {
    const mod = await modules[path]();
    const slug = path.split("/").pop().replace(".md", "");

    posts.push({
      slug,
      title: mod.metadata.title,
      date: mod.metadata.date,
      description: mod.metadata.description,
      tags: mod.metadata.tags || [],
      content: mod.default,
    });
  }

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getAllTags(posts) {
  const tagSet = new Set();
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}
