<script lang="ts">
  import { page } from "$app/state";
  import { site } from "$lib/seo";

  let {
    title = site.title,
    description = site.description,
    path = undefined,
    image = site.image,
    imageType = "image/png",
    imageWidth = site.imageWidth,
    imageHeight = site.imageHeight,
    imageAlt = site.imageAlt,
    type = "website",
    keywords = undefined,
    publishedTime = undefined,
    tags = [],
    noindex = false,
    jsonLd = [],
  }: {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
    imageType?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
    type?: "website" | "article";
    keywords?: string;
    publishedTime?: string;
    tags?: string[];
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  } = $props();

  const canonicalUrl = $derived(
    new URL(path ?? page.url.pathname, page.url.origin).href,
  );
  const imageUrl = $derived(new URL(image, page.url.origin).href);
  const structured = $derived(
    [jsonLd].flat().map((node) =>
      JSON.stringify({ "@context": "https://schema.org", ...node }).replace(
        /</g,
        "\\u003c",
      ),
    ),
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords}<meta name="keywords" content={keywords} />{/if}
  <meta
    name="robots"
    content={noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1"}
  />
  <meta name="author" content={site.name} />
  <meta name="theme-color" content={site.themeColor} />
  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:locale" content={site.locale} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:image:type" content={imageType} />
  <meta property="og:image:width" content={String(imageWidth)} />
  <meta property="og:image:height" content={String(imageHeight)} />
  <meta property="og:image:alt" content={imageAlt} />

  {#if type === "article"}
    {#if publishedTime}<meta
        property="article:published_time"
        content={publishedTime}
      />{/if}
    <meta property="article:author" content={site.name} />
    {#each tags as tag}<meta property="article:tag" content={tag} />{/each}
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />
  <meta name="twitter:image:alt" content={imageAlt} />

  {#each structured as json}
    {@html `<script type="application/ld+json">${json}<\/script>`}
  {/each}
</svelte:head>
