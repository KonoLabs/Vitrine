<script>
  import { page } from "$app/stores";
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  const sections = [
    { label: "Home", href: "/", icon: "pixelarticons:home" },
    { label: "Projects", href: "/projects", icon: "pixelarticons:code" },
    { label: "Blog", href: "/blog", icon: "pixelarticons:article" },
  ];

  function isActive(href, pathname) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  let isDark = $state(false);
  let mounted = $state(false);
  let pathname = $derived($page.url.pathname);

  onMount(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = stored === 'dark' || (!stored && prefersDark);
    applyTheme();
    mounted = true;
  });

  function applyTheme() {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme();
  }
</script>

<nav>
  <div class="nav-links">
    {#each sections as section}
      <a href={section.href} class:active={isActive(section.href, pathname)}>
        <Icon icon={section.icon} width="16" />
        <span>{section.label}</span>
      </a>
    {/each}
  </div>
  {#if mounted}
    <button
      onclick={toggleTheme}
      class="theme-switcher"
      aria-label="Toggle theme"
    >
      {#if isDark}
        <Icon icon="pixelarticons:sun" width="20" />
      {:else}
        <Icon icon="pixelarticons:moon" width="20" />
      {/if}
    </button>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  .nav-links a {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-links a.active {
    font-weight: bold;
  }

  .theme-switcher {
    background: var(--bg);
    color: var(--fg);
    border: 2px solid var(--border);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-switcher:hover {
    background: var(--subtle);
  }
</style>
