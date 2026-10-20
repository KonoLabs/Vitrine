<script lang="ts">
  import Backdrop from "$lib/components/sections/Backdrop.svelte";
  import TopNav from "$lib/components/sections/TopNav.svelte";
  import Hero from "$lib/components/sections/Hero.svelte";
  import Inspector from "$lib/components/sections/Inspector.svelte";
  import Delivery from "$lib/components/sections/Delivery.svelte";
  import Capabilities from "$lib/components/sections/Capabilities.svelte";
  import Fusible from "$lib/components/sections/Fusible.svelte";
  import Contact from "$lib/components/sections/Contact.svelte";
  import Footer from "$lib/components/sections/Footer.svelte";
</script>

<svelte:head>
  <title>KONO // HARDWARE, FIRMWARE & SOFTWARE ENGINEERING</title>
</svelte:head>

<div
  class="relative min-h-screen bg-[#000000] text-[#FFFFFF] font-['undefined',monospace] selection:bg-[#86A881] selection:text-[#000000] overflow-x-hidden antialiased"
>
  <Backdrop />

  <TopNav />

  <main
    class="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-8 pb-24 space-y-24 md:space-y-36"
  >
    <Hero />
    <Inspector />
    <Delivery />
    <Capabilities />
    <Fusible />
    <Contact />
    <Footer />
  </main>
</div>
