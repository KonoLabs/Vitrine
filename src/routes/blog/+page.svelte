<script>
  import Blog from "$lib/components/sections/Blog.svelte";
</script>

<svelte:head>
  <title>Blog - Saravenpi</title>
  <meta
    name="description"
    content="Read my thoughts on web development, technology trends, and programming insights. Join me on my journey as a full-stack developer."
  />
  <meta name="author" content="saravenpi" />
  <meta name="robots" content="index, follow" />
  <meta
    name="keywords"
    content="blog, web development, programming, technology, JavaScript, Svelte, tutorials"
  />
  <meta name="theme-color" content="#16a34a" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://saravenpi.com/blog" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Blog - Saravenpi" />
  <meta
    property="og:description"
    content="Read my thoughts on web development, technology trends, and programming insights. Join me on my journey as a full-stack developer."
  />
  <meta property="og:url" content="https://saravenpi.com/blog" />
  <meta property="og:site_name" content="Saravenpi's Blog" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Blog - Saravenpi" />
  <meta
    name="twitter:description"
    content="Read my thoughts on web development, technology trends, and programming insights. Join me on my journey as a full-stack developer."
  />
  <meta name="twitter:creator" content="@saravenpi" />
  
  <!-- JSON-LD Structured Data -->
  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Saravenpi's Blog",
    "description": "Read my thoughts on web development, technology trends, and programming insights. Join me on my journey as a full-stack developer.",
    "url": "https://saravenpi.com/blog",
    "author": {
      "@type": "Person",
      "name": "saravenpi",
      "url": "https://saravenpi.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "saravenpi",
      "url": "https://saravenpi.com"
    },
    "inLanguage": "en-US"
  }
  </script>`}
</svelte:head>

<Blog />
