<script lang="ts">
  import PcbViewer from "$lib/components/PcbViewer.svelte";

  const specs = [
    { label: "BOARD", value: "80 × 60 mm · 2-layer" },
    { label: "PARTS", value: "39 components" },
    { label: "NETS", value: "117 connections" },
  ];
</script>

<section id="fieldcam" class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="text-xs text-[#86A881] uppercase tracking-widest">
        CASE STUDY
      </div>
      <h2 class="text-xl md:text-2xl uppercase mt-1">
        FIELD CAM: A BOARD YOU CAN ORBIT
      </h2>
    </div>
    <div class="text-xs uppercase tracking-widest text-[#FFFFFF] md:text-right">
      ESP32-S3 · 4G LTE · SUB-GHz
    </div>
  </div>

  <PcbViewer />

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-8 bg-[#1F1F1F] p-6 md:p-8 space-y-5">
      <p class="text-sm text-[#FFFFFF]/80 leading-relaxed">
        FieldCam is an autonomous field camera for remote farms. Its controller
        board carries the ESP32-S3, the camera interface, a 4G modem, a sub-GHz
        voice link and the entire power chain. The board is written as code,
        checked by Fusible, and exported to glTF — so what you just orbited is
        the design itself, not a render of it.
      </p>
      <div class="space-y-2 text-xs text-[#86A881]">
        <div>+ Designed in tscircuit, verified by the fuse contract</div>
        <div>+ Same circuit JSON that generates the firmware pin map</div>
        <div>+ Model baked from the export, loaded only when in view</div>
      </div>
    </div>

    <div
      class="lg:col-span-4 bg-[#1F1F1F] p-6 md:p-8 flex flex-col justify-between gap-6"
    >
      <div class="space-y-3">
        {#each specs as spec}
          <div
            class="flex items-baseline justify-between gap-3 border-b border-[#2E2E2E] pb-2 text-[10px] uppercase tracking-widest"
          >
            <span class="text-[#FFFFFF]/45">{spec.label}</span>
            <span class="text-[#FFFFFF]">{spec.value}</span>
          </div>
        {/each}
      </div>

      <a
        href="/fieldcam"
        class="inline-flex items-center gap-3 bg-[#86A881] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF] transition-colors"
      >
        &gt; OPEN THE CASE STUDY
      </a>
    </div>
  </div>
</section>
