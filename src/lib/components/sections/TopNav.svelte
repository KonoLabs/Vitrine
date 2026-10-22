<script lang="ts">
  import Icon from "@iconify/svelte";

  let scrollY = $state(0);
  let isScrolled = $derived(scrollY > 20);
  let mobileMenuOpen = $state(false);
</script>

<svelte:window
  bind:scrollY
  onkeydown={(e) => {
    if (e.key === "Escape" && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }}
/>

<div class="h-14 md:h-16 w-full" aria-hidden="true"></div>

<header
  class="reveal-nav fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
>
  <div
    class="pointer-events-auto transition-all duration-300 ease-out {isScrolled
      ? 'w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1440px] mt-2 md:mt-3 px-4 md:px-6 py-3 bg-[#000000] shadow-2xl'
      : 'w-full max-w-full mt-0 px-6 md:px-12 py-4 bg-[#000000]'}"
  >
    <div
      class="max-w-[1440px] mx-auto flex items-center justify-between gap-4 text-[11px] uppercase tracking-widest leading-none"
    >
      <a href="/" class="flex items-center gap-2 no-underline">
        <img
          src="/long-logo-green-bg.png"
          alt="KONO"
          class="h-6 w-auto block"
        />
      </a>

      <div class="hidden md:flex items-center gap-6">
        <a
          href="#inspector"
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-2 py-1 leading-none transition-colors"
          >EXAMPLES</a
        >
        <a
          href="#delivery"
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-2 py-1 leading-none transition-colors"
          >DELIVERY</a
        >
        <a
          href="#capabilities"
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-2 py-1 leading-none transition-colors"
          >SERVICES</a
        >
        <a
          href="#fusible"
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-2 py-1 leading-none transition-colors"
          >FUSIBLE</a
        >
        <a
          href="#fieldcam"
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-2 py-1 leading-none transition-colors"
          >FIELD CAM</a
        >
        <a
          href="#terminal"
          class="no-underline bg-[#86A881] text-[#000000] px-3 py-1 leading-none hover:bg-[#FFFFFF] transition-colors"
          >CONTACT</a
        >
      </div>

      <button
        type="button"
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        class="md:hidden flex items-center justify-center p-1 text-[#FFFFFF] hover:text-[#86A881] cursor-pointer"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        <Icon icon="pixelarticons:menu" class="w-6 h-6" />
      </button>
    </div>
  </div>
</header>

{#if mobileMenuOpen}
  <button
    type="button"
    class="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 md:hidden border-none p-0 cursor-pointer transition-opacity duration-300"
    onclick={() => (mobileMenuOpen = false)}
    aria-label="Close navigation overlay"
    tabindex="-1"
  ></button>

  <aside
    class="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-[#000000] z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden transform transition-transform duration-300 ease-out translate-x-0"
    aria-label="Mobile navigation"
    style="will-change: transform;"
  >
    <div class="space-y-8">
      <div
        class="flex items-center justify-between pb-4 border-b border-[var(--color-border)]"
      >
        <img src="/long-logo-green-bg.png" alt="KONO" class="h-5 w-auto" />
        <button
          type="button"
          onclick={() => (mobileMenuOpen = false)}
          class="p-1 text-[#FFFFFF] hover:text-[#86A881] cursor-pointer"
          aria-label="Close menu"
        >
          <Icon icon="pixelarticons:close" class="w-6 h-6" />
        </button>
      </div>

      <div
        class="flex flex-col space-y-2 text-[12px] uppercase tracking-widest"
      >
        <a
          href="#inspector"
          onclick={() => (mobileMenuOpen = false)}
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-3 py-2 transition-colors"
          >EXAMPLES</a
        >
        <a
          href="#delivery"
          onclick={() => (mobileMenuOpen = false)}
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-3 py-2 transition-colors"
          >DELIVERY</a
        >
        <a
          href="#capabilities"
          onclick={() => (mobileMenuOpen = false)}
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-3 py-2 transition-colors"
          >SERVICES</a
        >
        <a
          href="#fusible"
          onclick={() => (mobileMenuOpen = false)}
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-3 py-2 transition-colors"
          >FUSIBLE</a
        >
        <a
          href="#fieldcam"
          onclick={() => (mobileMenuOpen = false)}
          class="text-[#FFFFFF] no-underline hover:bg-[#86A881] hover:text-[#000000] px-3 py-2 transition-colors"
          >FIELD CAM</a
        >
        <a
          href="#terminal"
          onclick={() => (mobileMenuOpen = false)}
          class="no-underline bg-[#86A881] text-[#000000] px-3 py-2.5 hover:bg-[#FFFFFF] transition-colors text-center mt-4"
          >CONTACT</a
        >
      </div>
    </div>

    <div class="pt-6 border-t border-[var(--color-border)]">
      <a
        href="mailto:yann@facile.studio"
        class="inline-flex items-center gap-2 text-[11px] text-[#FFFFFF]/70 hover:text-[#86A881] no-underline tracking-wider leading-none"
      >
        <Icon
          icon="pixelarticons:mail"
          class="w-4 h-4 shrink-0 translate-y-[0.5px]"
        />
        <span class="leading-none">yann@facile.studio</span>
      </a>
    </div>
  </aside>
{/if}
