<script>
  import { onMount } from "svelte";
  import Icon from '@iconify/svelte';
  import { loadBlogPosts, getAllTags } from "$lib/utils.js";
  let posts = [];
  let filteredPosts = [];
  let allTags = [];
  let selectedTag = null;

  onMount(async () => {
    try {
      posts = await loadBlogPosts();
      filteredPosts = posts;
      allTags = getAllTags(posts);
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    }
  });

  function filterByTag(tag) {
    if (selectedTag === tag) {
      selectedTag = null;
      filteredPosts = posts;
    } else {
      selectedTag = tag;
      filteredPosts = posts.filter((post) => post.tags && post.tags.includes(tag));
    }
  }

  function resetFilter() {
    selectedTag = null;
    filteredPosts = posts;
  }
</script>

<main>
  <h1 class="page-title">
    <Icon icon="pixelarticons:article" width="28" />
    <span>Blog</span>
  </h1>
  {#if allTags.length > 0}
    <p>
      <button on:click={resetFilter} style={selectedTag === null ? 'font-weight: bold;' : ''}>All ({posts.length})</button>
      {#each allTags as tag}
        <button on:click={() => filterByTag(tag)} style={selectedTag === tag ? 'font-weight: bold;' : ''}>{tag} ({posts.filter((p) => p.tags && p.tags.includes(tag)).length})</button>
      {/each}
    </p>
  {/if}
  {#if filteredPosts.length === 0}
    <p>{posts.length === 0 ? "No posts yet..." : `No posts found with tag "${selectedTag}"`}</p>
  {:else}
    {#each filteredPosts as post}
      <article>
        <h2><a href="/blog/{post.slug}">{post.title}</a></h2>
        {#if post.date}<p><time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></p>{/if}
        {#if post.description}<p>{post.description}</p>{/if}
        {#if post.tags && post.tags.length > 0}<p><small>Tags: {post.tags.join(", ")}</small></p>{/if}
      </article>
    {/each}
  {/if}
</main>

<style>
  .page-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  article { margin: 2rem 0; padding: 1rem 0; border-bottom: 1px solid #cdb8a0; }
  article:last-child { border-bottom: none; }
  button { background: none; border: none; color: #6a7d3e; text-decoration: underline; cursor: pointer; font-family: inherit; font-size: inherit; margin-right: 0.5rem; }
  button:hover { color: #507964; }
  time { color: #a89985; font-size: 0.9rem; }
</style>
