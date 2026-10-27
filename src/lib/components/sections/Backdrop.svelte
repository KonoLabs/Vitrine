<script lang="ts">
  let {
    introActive = false,
    wiping = false,
  }: { introActive?: boolean; wiping?: boolean } = $props();

  // Black while the green intro is on screen, green once the wipe hands the
  // page back. The class transition starts with the wipe, not after it.
  const inverted = $derived(introActive && !wiping);

  let mouseX = $state(0);
  let mouseY = $state(0);
  let pointerInside = $state(false);
</script>

<svelte:window
  onmousemove={(e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    pointerInside = true;
  }}
  onmouseout={(e) => {
    if (!e.relatedTarget) pointerInside = false;
  }}
/>

<div
  class="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,var(--color-surface)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-surface)_1px,transparent_1px)] bg-[size:16px_16px]"
></div>
<div
  class="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#88A888_1px,transparent_1px),linear-gradient(to_bottom,#88A888_1px,transparent_1px)] bg-[size:96px_96px]"
></div>

{#if pointerInside}
  <div
    class="fixed inset-0 pointer-events-none hidden lg:block {introActive
      ? 'z-[60]'
      : 'z-40'}"
  >
    <div
      class="absolute left-0 right-0 h-[1px] transition-colors duration-700 ease-out {inverted
        ? 'bg-[#000000]/35'
        : 'bg-[#88A888]/30'}"
      style="top: {mouseY}px;"
    ></div>
    <div
      class="absolute top-0 bottom-0 w-[1px] transition-colors duration-700 ease-out {inverted
        ? 'bg-[#000000]/35'
        : 'bg-[#88A888]/30'}"
      style="left: {mouseX}px;"
    ></div>
    <div
      class="absolute px-2 py-1 text-[10px] tracking-widest whitespace-nowrap transition-colors duration-700 ease-out {inverted
        ? 'bg-[#88A888] text-[#000000]'
        : 'bg-[#000000] text-[#88A888]'}"
      style="left: {mouseX + 12}px; top: {mouseY + 12}px;"
    >
      X:{mouseX.toString().padStart(4, "0")} Y:{mouseY
        .toString()
        .padStart(4, "0")} 0x{(mouseX ^ mouseY)
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")}
    </div>
  </div>
{/if}
