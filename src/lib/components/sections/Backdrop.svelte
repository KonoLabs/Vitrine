<script lang="ts">
  let { introActive = false }: { introActive?: boolean } = $props();

  let mouseX = $state(0);
  let mouseY = $state(0);
</script>

<svelte:window
  onmousemove={(e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }}
/>

<div
  class="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1F1F1F_1px,transparent_1px),linear-gradient(to_bottom,#1F1F1F_1px,transparent_1px)] bg-[size:16px_16px]"
></div>
<div
  class="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#86A881_1px,transparent_1px),linear-gradient(to_bottom,#86A881_1px,transparent_1px)] bg-[size:96px_96px]"
></div>

<div
  class="fixed inset-0 pointer-events-none hidden lg:block {introActive
    ? 'z-[60]'
    : 'z-40'}"
>
  <div
    class="absolute left-0 right-0 h-[1px] {introActive
      ? 'bg-[#000000]/35'
      : 'bg-[#86A881]/30'}"
    style="top: {mouseY}px;"
  ></div>
  <div
    class="absolute top-0 bottom-0 w-[1px] {introActive
      ? 'bg-[#000000]/35'
      : 'bg-[#86A881]/30'}"
    style="left: {mouseX}px;"
  ></div>
  <div
    class="absolute px-2 py-1 text-[10px] tracking-widest whitespace-nowrap {introActive
      ? 'bg-[#86A881] text-[#000000]'
      : 'bg-[#000000] text-[#86A881]'}"
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
