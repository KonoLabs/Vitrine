<script lang="ts">
  type TargetKey = "luckfox" | "esp32";

  interface Target {
    code: string;
    name: string;
    arch: string;
    clock: string;
    mem: string;
    os: string;
  }

  const targets: Record<TargetKey, Target> = {
    luckfox: {
      code: "SOC_RV1106",
      name: "LUCKFOX PICO // ROCKCHIP RV1106",
      arch: "ARM Cortex-A7 + RISC-V MCU + 1.0 TOPS NPU",
      clock: "1.2 GHz / 250 MHz",
      mem: "256MB DDR3L / SPI NAND",
      os: "Custom Buildroot / BusyBox / Linux 5.10"
    },
    esp32: {
      code: "MCU_ESP32_S3",
      name: "ESP32-S3 // DUAL-CORE XTENSA LX7",
      arch: "Dual Xtensa LX7 + ULP RISC-V Co-Processor",
      clock: "240 MHz",
      mem: "512KB SRAM / 8MB Octal PSRAM / 16MB Flash",
      os: "ESP-IDF v5.x / FreeRTOS SMP"
    }
  };

  const tabs: { key: TargetKey; label: string }[] = [
    { key: "luckfox", label: "[01] LUCKFOX RV1106" },
    { key: "esp32", label: "[02] ESP32-S3 / C6" }
  ];

  // Engagement Models (business data)
  const engagement = [
    {
      name: "Fixed-Scope Project",
      tag: "48H QUOTE",
      desc: "Fixed price, milestone-based payments, full IP and source transfer on delivery."
    },
    {
      name: "Monthly Retainer",
      tag: "FLEX HOURS",
      desc: "Reserved engineering hours for iteration, field support and urgent board fixes."
    },
    {
      name: "Audit / Rescue",
      tag: "2-5 DAYS",
      desc: "Design review, DFM pass or code audit of an existing PCB, firmware or repository."
    }
  ];

  // Interactive Board / Target Selector
  let selectedTarget = $state<TargetKey>("luckfox");
</script>

<!-- SECTION 01: EXAMPLE TARGET ARCHITECTURES -->
<section id="inspector" class="space-y-8">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
    <div class="md:col-span-4">
      <div class="text-xs text-[#86A881] uppercase tracking-widest mb-2">
        01 // EXAMPLE TARGET ARCHITECTURES
      </div>
      <h2 class="text-2xl md:text-3xl uppercase">INTERACTIVE ARCHITECTURE INSPECTOR</h2>
    </div>
    <div class="md:col-span-8 flex flex-col items-end gap-3">
      <span class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/50 text-right">
        Representative targets // we ship on any MCU, SoC, SBC or server
      </span>
      <div class="flex flex-wrap gap-3 md:justify-end">
        {#each tabs as tab}
          <button
            onclick={() => (selectedTarget = tab.key)}
            class="px-5 py-3 text-xs uppercase tracking-widest cursor-pointer {selectedTarget ===
            tab.key
              ? 'bg-[#86A881] text-[#000000]'
              : 'bg-[#353535] text-[#FFFFFF] hover:bg-[#404040]'}"
          >
            {tab.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Active Target Datasheet Panel -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {#key selectedTarget}
      {@const target = targets[selectedTarget]}
      <!-- Target Specs -->
      <div class="lg:col-span-7 bg-[#353535] p-6 md:p-8 space-y-6">
        <div class="bg-[#000000] p-4">
          <span class="text-[10px] text-[#86A881] block">TARGET_ID // {target.code}</span>
          <h3 class="text-lg md:text-xl text-[#FFFFFF] uppercase">{target.name}</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="bg-[#404040] p-4">
            <span class="text-[10px] text-[#86A881] block mb-1">CORE ARCH</span>
            <span>{target.arch}</span>
          </div>
          <div class="bg-[#404040] p-4">
            <span class="text-[10px] text-[#86A881] block mb-1">CLOCK</span>
            <span>{target.clock}</span>
          </div>
          <div class="bg-[#404040] p-4">
            <span class="text-[10px] text-[#86A881] block mb-1">MEMORY</span>
            <span>{target.mem}</span>
          </div>
        </div>

        <div class="text-[10px] text-[#86A881] uppercase tracking-widest">OS_ENV: {target.os}</div>
      </div>
    {/key}

    <!-- Engagement / Business Panel -->
    <div class="lg:col-span-5 bg-[#404040] p-6 md:p-8 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs text-[#86A881] uppercase tracking-widest">ENGAGEMENT MODELS</span>
          <span class="text-[10px] bg-[#000000] text-[#FFFFFF] px-2 py-1">NDA BY DEFAULT</span>
        </div>

        <div class="space-y-3">
          {#each engagement as eng}
            <div class="bg-[#000000] p-4 space-y-1.5">
              <div class="flex justify-between items-center gap-3">
                <span class="text-xs text-[#FFFFFF] uppercase">{eng.name}</span>
                <span class="text-[10px] text-[#000000] bg-[#86A881] px-1.5 py-0.5">{eng.tag}</span>
              </div>
              <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">{eng.desc}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="mt-6 bg-[#000000] p-3 text-[11px] text-[#86A881] flex justify-between gap-3">
        <span>RESPONSE_TIME: &lt; 24H</span>
        <span>[REMOTE // WORLDWIDE]</span>
      </div>
    </div>
  </div>
</section>
