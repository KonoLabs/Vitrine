<script lang="ts">
  import PcbViewer from "$lib/components/PcbViewer.svelte";
  import Seo from "$lib/components/Seo.svelte";

  const subsystems = [
    {
      code: "SENSING",
      items: [
        "ESP32-S3R8 controller",
        "OV2640 DVP camera, 8-bit parallel",
        "EKMB1101111 PIR wake sensor",
        "Battery telemetry divider",
      ],
    },
    {
      code: "LINK",
      items: [
        "SIM7600G-H 4G LTE modem",
        "RFM69HCW sub-GHz transceiver",
        "PAM8302A voice amplifier",
        "SMA antenna + speaker terminals",
      ],
    },
    {
      code: "POWER",
      items: [
        "USB-C inlet with CC resistors",
        "MCP73831 LiPo charger",
        "Diode-OR load sharing",
        "AP2112K 3.3 V regulator",
      ],
    },
  ];

  const facts = [
    { label: "BOARD", value: "80 × 60 mm" },
    { label: "STACKUP", value: "2 layers · 1.4 mm" },
    { label: "PARTS", value: "39" },
    { label: "CONNECTIONS", value: "117" },
  ];

  const pipeline = [
    {
      step: "01",
      title: "CIRCUIT AS CODE",
      text: "The board is written in tscircuit TSX, so the schematic, layout and netlist all come from one file.",
    },
    {
      step: "02",
      title: "FAIL-CLOSED CHECK",
      text: "Fusible lints the exported circuit JSON and refuses to generate firmware for a board that fails.",
    },
    {
      step: "03",
      title: "BAKED FOR THE WEB",
      text: "That same JSON is converted to a single glTF at asset time, so this page ships a 1.7 MB model instead of a CAD kernel.",
    },
  ];
</script>

<Seo
  title="FieldCam — ESP32-S3 field camera PCB | Kono"
  description="An interactive 3D view of the FieldCam controller board: ESP32-S3, OV2640 camera, 4G LTE, sub-GHz voice and LiPo power, designed in tscircuit and checked with Fusible."
  path="/fieldcam"
  keywords="FieldCam, ESP32-S3, PCB design, tscircuit, Fusible, 3D PCB viewer, 4G LTE, sub-GHz"
/>

<div class="relative min-h-screen bg-[#000000] text-[#FFFFFF]">
  <header class="border-b border-[#1F1F1F]">
    <div
      class="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4 text-[11px] uppercase tracking-widest"
    >
      <a href="/" class="no-underline flex items-center gap-2">
        <img
          src="/long-logo-green-bg.png"
          alt="KONO"
          class="h-6 w-auto block"
        />
      </a>
      <a
        href="/projects"
        class="text-[#FFFFFF]/60 no-underline hover:text-[#86A881] transition-colors"
        >← ALL WORK</a
      >
    </div>
  </header>

  <main
    class="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 pb-24 space-y-12 md:space-y-16"
  >
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="text-xs text-[#86A881] uppercase tracking-widest">
            SELECTED WORK
          </div>
          <h1 class="text-3xl md:text-4xl uppercase mt-2">FIELD CAM</h1>
          <p class="text-sm text-[#FFFFFF]/75 max-w-2xl mt-3 leading-relaxed">
            A field camera unit for remote farms: 4G LTE carries video back to a
            self-hosted server, while sub-GHz RF carries push-to-talk voice back
            to the field in milliseconds. This is the controller board at the
            centre of it.
          </p>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-x-8 gap-y-3 text-[10px] uppercase tracking-widest shrink-0"
        >
          {#each facts as fact}
            <div>
              <div class="text-[#FFFFFF]/45">{fact.label}</div>
              <div class="text-[#86A881] mt-0.5">{fact.value}</div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <PcbViewer />

      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-[#FFFFFF]/45"
      >
        <span>
          Live glTF export of the tscircuit circuit — 39 components, 117
          connections
        </span>
        <a
          href="https://github.com/KonoLabs/FieldCam"
          class="text-[#86A881] no-underline hover:text-[#FFFFFF] transition-colors shrink-0"
        >
          github.com/KonoLabs/FieldCam ↗
        </a>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each subsystems as subsystem}
        <div class="bg-[#1F1F1F] p-6 md:p-7 space-y-3">
          <div class="text-[10px] uppercase tracking-widest text-[#86A881]">
            {subsystem.code}
          </div>
          <ul class="space-y-1.5 text-xs text-[#FFFFFF]/75">
            {#each subsystem.items as item}
              <li class="leading-relaxed">+ {item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>

    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <h2 class="text-xl md:text-2xl uppercase">ONE BOARD, ONE FILE</h2>
        <span class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
          HARDWARE · FIRMWARE · DOCS
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each pipeline as item}
          <div class="border-t border-[#2E2E2E] pt-4 space-y-2">
            <span class="text-[10px] uppercase tracking-widest text-[#86A881]"
              >{item.step}</span
            >
            <div class="text-xs uppercase text-[#FFFFFF]">{item.title}</div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {item.text}
            </p>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <a
        href="https://github.com/KonoLabs/FieldCam"
        class="inline-flex items-center gap-3 bg-[#86A881] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF] transition-colors"
      >
        &gt; READ THE CASE STUDY
      </a>
    </section>
  </main>
</div>
