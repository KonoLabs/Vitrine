<script>
  import { page } from "$app/stores";
  export let data;
</script>

<svelte:head>
  <title>{data.meta.title} - Saravenpi's Blog</title>
  <meta name="description" content={data.meta.description} />
  <meta name="author" content="saravenpi" />
  <meta name="robots" content="index, follow" />
  <meta name="keywords" content={data.meta.tags ? data.meta.tags.join(", ") : "blog, web development, programming"} />
  <meta name="theme-color" content="#16a34a" />
  <link rel="canonical" href="https://saravenpi.com/blog/{$page.params.slug}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{data.meta.title} - Saravenpi's Blog" />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:url" content="https://saravenpi.com/blog/{$page.params.slug}" />
  <meta property="og:site_name" content="Saravenpi's Blog" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content={data.meta.date} />
  <meta property="article:author" content="saravenpi" />
  <meta property="article:section" content="Technology" />
  {#if data.meta.tags}{#each data.meta.tags as tag}<meta property="article:tag" content={tag} />{/each}{/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{data.meta.title} - Saravenpi's Blog" />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:creator" content="@saravenpi" />
</svelte:head>

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

<style>
  article { margin: 2rem 0; }
  hr { border: none; border-top: 1px solid #cdb8a0; margin: 1.5rem 0; }
  time { color: #a89985; font-size: 0.9rem; }
  .content :global(h1) { font-size: 2rem; margin: 2.5rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 2px solid #4a3728; }
  .content :global(h2) { font-size: 1.5rem; margin: 2rem 0 0.75rem 0; padding-bottom: 0.4rem; border-bottom: 1px solid #cdb8a0; }
  .content :global(h3) { font-size: 1.25rem; margin: 1.5rem 0 0.5rem 0; padding-bottom: 0.3rem; border-bottom: 1px solid #e8dcc8; }
  .content :global(h4), .content :global(h5), .content :global(h6) { margin: 1.5rem 0 0.5rem 0; }
  .content :global(p) { margin: 1rem 0; line-height: 1.8; }
  .content :global(code) { background: #e8dcc8; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Undefined', monospace; }
  .content :global(pre) { background: #e8dcc8; padding: 1rem; overflow-x: auto; border-left: 3px solid #4a3728; margin: 1.5rem 0; }
  .content :global(pre code) { background: none; padding: 0; }
  .content :global(blockquote) { border-left: 3px solid #a89985; padding-left: 1rem; margin: 1.5rem 0; color: #7a6f5d; }
  .content :global(ul), .content :global(ol) { margin: 1rem 0; padding-left: 2rem; line-height: 1.8; }
  .content :global(li) { margin: 0.5rem 0; }
</style>
