<!-- HERO SECTION: Asymmetric Swiss Layout + Animated PCB Schematic -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
  <!-- Left Column: Manifesto & Direct Callouts -->
  <div class="lg:col-span-7 flex flex-col justify-between space-y-8">
    <div class="space-y-6">
      <img src="/long-logo-transparent-bg.png" alt="KONO" class="h-10 md:h-14 w-auto" />
      <div
        class="inline-flex items-center gap-3 bg-[#353535] px-3 py-1.5 text-xs text-[#86A881] uppercase tracking-widest"
      >
        <span>[SCHEMATIC REV 4.2]</span>
        <span class="text-[#FFFFFF]">//</span>
        <span class="text-[#FFFFFF]">SILICON TO SHIP</span>
      </div>

      <h1 class="text-4xl sm:text-5xl xl:text-6xl leading-[1.08] uppercase tracking-tight">
        CUSTOM <span class="bg-[#86A881] text-[#000000] px-2">PCB</span> HARDWARE, EMBEDDED
        <span class="text-[#86A881]">FIRMWARE</span> & FULL-STACK SOFTWARE.
      </h1>

      <p class="text-sm md:text-base text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
        Kono is a hardware and software engineering foundry. We route multi-layer circuit boards,
        write deterministic firmware for anything from 8-bit microcontrollers to
        <span class="text-[#86A881]">ESP32</span> and
        <span class="text-[#86A881]">Luckfox RV1106</span>-class SoCs — and build the software
        around them just as often: backend services, APIs, static binaries and websites, zero
        dependency bloat.
      </p>
    </div>

    <div class="flex flex-wrap gap-4">
      <a
        href="#terminal"
        class="bg-[#86A881] text-[#000000] px-8 py-4 text-xs uppercase tracking-widest hover:bg-[#FFFFFF]"
      >
        &gt; TRANSMIT_GERBERS_OR_SPECS
      </a>
    </div>
  </div>

  <!-- Animated SVG PCB Routing Blueprint -->
  <div class="lg:col-span-5 flex flex-col gap-3">
    <div class="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#86A881]">
      <span>CAD_VIEW // KONO-CARRIER-V4.KICAD_PCB</span>
    </div>

    <!-- Animated Vector PCB Schematic -->
    <svg viewBox="0 20 400 300" class="w-full h-auto block">
      <!-- Copper Traces (Static Base) -->
      <g stroke="#404040" stroke-width="2.5" fill="none">
        <path d="M 30 50 L 90 50 L 120 80 L 155 80" />
        <path d="M 30 90 L 80 90 L 110 120 L 155 120" />
        <path d="M 30 130 L 70 130 L 100 160 L 155 160" />
        <path d="M 245 80 L 290 80 L 320 50 L 370 50" />
        <path d="M 245 120 L 300 120 L 240 120 L 370 120" />
        <path d="M 245 160 L 285 160 L 215 160 L 310 210 L 370 210" />
        <path d="M 180 195 L 180 230 L 240 280 L 290 270" />
        <path d="M 200 195 L 200 230 L 290 230 L 360 290" />
        <path d="M 220 195 L 220 230 L 260 230 L 240 260" />
      </g>

      <!-- Animated High-Speed Signal Pulses on Traces -->
      <g
        stroke="#86A881"
        stroke-width="2.5"
        fill="none"
        stroke-dasharray="14 120"
        class="pcb-pulse"
      >
        <path d="M 30 50 L 90 50 L 120 80 L 135 80" />
        <path d="M 30 90 L 80 90 L 110 120 L 125 120" />
        <path d="M 30 130 L 70 130 L 100 160 L 115 160" />
        <path d="M 155 80 L 180 80 L 210 50 L 265 50" />
        <path d="M 155 120 L 180 120 L 240 120 L 265 120" />
        <path d="M 155 160 L 210 160 L 240 160 L 265 160" />
        <path d="M 265 80 L 290 80 L 320 50 L 365 50" />
        <path d="M 265 120 L 290 120 L 330 150 L 365 150" />
        <path d="M 265 160 L 285 160 L 310 210 L 365 210" />
        <path d="M 110 280 L 180 280 L 180 230 L 175 195" />
        <path d="M 40 280 L 180 280 L 220 280 L 250 255" />
        <path d="M 220 280 L 290 280 L 330 265" />
      </g>

      <!-- BGA / QFN Main SoC Package in Center -->
      <rect x="155" y="65" width="90" height="90" fill="#353535" />
      <rect x="165" y="75" width="70" height="70" fill="#000000" />
      <!-- Pin 1 Indicator (static, as in real EDA tooling) -->
      <rect x="170" y="80" width="6" height="6" fill="#86A881" />
      <text x="172" y="115" fill="#86A881" font-size="9" font-family="monospace">MCU / SOC</text>
      <text x="172" y="130" fill="#FFFFFF" font-size="7" font-family="monospace">KONO_CORE</text>

      <!-- Secondary IC (SPI NAND / Transceiver) -->
      <rect x="165" y="165" width="70" height="30" fill="#404040" />
      <text x="175" y="183" fill="#FFFFFF" font-size="8" font-family="monospace">W25Q128JV</text>

      <!-- Via Pads & Test Points -->
      {#each [[30, 50], [30, 90], [30, 130], [370, 50], [370, 150], [370, 210], [40, 280], [360, 290], [290, 270]] as [cx, cy]}
        <rect x={cx - 5} y={cy - 5} width="10" height="10" fill="#86A881" />
        <rect x={cx - 2} y={cy - 2} width="4" height="4" fill="#000000" />
      {/each}
    </svg>
  </div>
</section>

<style>
  @keyframes dashFlow {
    to {
      stroke-dashoffset: -268;
    }
  }
  .pcb-pulse {
    animation: dashFlow 3.2s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .pcb-pulse {
      animation: none;
    }
  }
</style>