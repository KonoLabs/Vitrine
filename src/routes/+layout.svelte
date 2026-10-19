<script>
  import "../app.css";
  import Navigation from "$lib/components/Navigation.svelte";
</script>

<svelte:head>
  <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
  <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
  <link rel="apple-touch-icon" href="/favicon.jpg" />

  <meta property="og:image" content="/favicon.jpg" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta name="twitter:image" content="/favicon.jpg" />
  <meta name="twitter:image:type" content="image/jpeg" />
</svelte:head>

<Navigation />
<slot />
