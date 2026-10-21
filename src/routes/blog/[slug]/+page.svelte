<script>
  import Seo from "$lib/components/Seo.svelte";
  import { site } from "$lib/seo";

  let { data } = $props();

  const tags = $derived(data.meta.tags ?? []);
</script>

<Seo
  title={data.meta.title ? `${data.meta.title} — ${site.name}` : site.title}
  description={data.meta.description ?? site.description}
  keywords={tags.length > 0 ? tags.join(", ") : undefined}
  type="article"
  publishedTime={data.meta.date}
  {tags}
/>

<div class="page-shell">
<article>
  <p><a href="/blog">← Back to Blog</a></p>
  <h1>{data.meta.title}</h1>
  {#if data.meta.date}<p><time>{new Date(data.meta.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></p>{/if}
  {#if data.meta.description}<p><em>{data.meta.description}</em></p>{/if}
  {#if data.meta.tags && data.meta.tags.length > 0}<p><small>Tags: {data.meta.tags.join(", ")}</small></p>{/if}
  <hr />
  <div class="content">
    <svelte:component this={data.content} />
  </div>
</article>
</div>

<style>
  article { margin: 2rem 0; }
  hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
  time { color: var(--link); font-size: 0.9rem; }
  .content :global(h1) { font-size: 2rem; margin: 2.5rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border); }
  .content :global(h2) { font-size: 1.5rem; margin: 2rem 0 0.75rem 0; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
  .content :global(h3) { font-size: 1.25rem; margin: 1.5rem 0 0.5rem 0; padding-bottom: 0.3rem; border-bottom: 1px solid var(--border); }
  .content :global(h4), .content :global(h5), .content :global(h6) { margin: 1.5rem 0 0.5rem 0; }
  .content :global(p) { margin: 1rem 0; line-height: 1.8; }
  .content :global(code) { background: var(--code-bg); color: var(--code-fg); padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Undefined', monospace; }
  .content :global(pre) { background: var(--code-bg); color: var(--code-fg); padding: 1rem; overflow-x: auto; border-left: 3px solid var(--link); margin: 1.5rem 0; }
  .content :global(pre code) { background: none; padding: 0; }
  .content :global(blockquote) { border-left: 3px solid var(--link); padding-left: 1rem; margin: 1.5rem 0; color: var(--link); }
  .content :global(ul), .content :global(ol) { margin: 1rem 0; padding-left: 2rem; line-height: 1.8; }
  .content :global(li) { margin: 0.5rem 0; }
</style>
