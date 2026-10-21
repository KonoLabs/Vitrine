<script lang="ts">
  import Backdrop from "$lib/components/sections/Backdrop.svelte";
  import SerpentTrace from "$lib/components/sections/SerpentTrace.svelte";
  import TopNav from "$lib/components/sections/TopNav.svelte";
  import Hero from "$lib/components/sections/Hero.svelte";
  import Inspector from "$lib/components/sections/Inspector.svelte";
  import Delivery from "$lib/components/sections/Delivery.svelte";
  import Capabilities from "$lib/components/sections/Capabilities.svelte";
  import Fusible from "$lib/components/sections/Fusible.svelte";
  import Contact from "$lib/components/sections/Contact.svelte";
  import Footer from "$lib/components/sections/Footer.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import { site } from "$lib/seo";

  let introActive = $state(true);

  $effect(() => {
    if (!introActive) {
      const targets = document.querySelectorAll(".scroll-reveal");
      if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("revealed"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -50px 0px",
          threshold: 0.08,
        }
      );

      targets.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }
  });
</script>

<Seo
  title={site.title}
  description={site.description}
  keywords={site.keywords}
  path="/"
/>

<div
  class="relative min-h-screen bg-[#000000] text-[#FFFFFF] font-['undefined',monospace] selection:bg-[#86A881] selection:text-[#000000] overflow-x-hidden antialiased"
>
  <Backdrop />
  <SerpentTrace bind:introActive />

  {#if !introActive}
    <TopNav />

    <main
      class="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-8 pb-24 space-y-24 md:space-y-36"
    >
      <Hero />
      <div class="scroll-reveal">
        <Inspector />
      </div>
      <div class="scroll-reveal">
        <Delivery />
      </div>
      <div class="scroll-reveal">
        <Capabilities />
      </div>
      <div class="scroll-reveal">
        <Fusible />
      </div>
      <div class="scroll-reveal">
        <Contact />
      </div>
      <div class="scroll-reveal">
        <Footer />
      </div>
    </main>
  {/if}
</div>
