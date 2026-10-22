<script>
  const posts = Object.entries(
    import.meta.glob("/src/posts/*.md", { eager: true }),
  )
    .map(([path, mod]) => ({
      slug: path.split("/").pop().replace(/\.md$/, ""),
      ...mod.metadata,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

<section class="max-w-[1440px] mx-auto px-6 md:px-12 py-12 space-y-8">
  <div>
    <span class="text-xs uppercase tracking-widest text-[#86A881]">WRITING</span
    >
    <h1 class="text-3xl md:text-4xl uppercase mt-2">BLOG</h1>
    <p class="text-sm max-w-2xl mt-2 text-[#FFFFFF]/75">
      Thoughts on web development, systems programming, and the tools in
      between.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each posts as post}
      <a
        href="/blog/{post.slug}"
        class="block p-6 no-underline bg-[var(--color-surface)] text-[#FFFFFF] transition-colors hover:bg-[var(--color-surface-hover)]"
      >
        <span class="text-[10px] uppercase tracking-widest text-[#86A881]">
          {formatDate(post.date)}
        </span>
        <h2 class="text-lg md:text-xl uppercase mt-2 mb-3">
          {post.title}
        </h2>
        {#if post.description}
          <p class="text-xs text-[#FFFFFF]/75 leading-relaxed">
            {post.description}
          </p>
        {/if}
        {#if post.tags && post.tags.length > 0}
          <div
            class="flex flex-wrap gap-x-3 gap-y-1 mt-4 text-[10px] uppercase tracking-widest text-[#86A881]"
          >
            {#each post.tags as tag}
              <span>· {tag}</span>
            {/each}
          </div>
        {/if}
      </a>
    {/each}
  </div>
</section>
