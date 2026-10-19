<script>
  import { onMount } from 'svelte';
  import { Icon } from '@iconify/svelte';

  let isDark = $state(false);
  let mounted = $state(false);

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

<style>
  .theme-switcher {
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    background: var(--bg);
    color: var(--fg);
    border: 2px solid var(--border);
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1000;
  }

  .theme-switcher:hover {
    background: var(--subtle);
  }

  @media (max-width: 600px) {
    .theme-switcher {
      bottom: 1rem;
      left: 1rem;
      width: 2rem;
      height: 2rem;
    }
  }
</style>
