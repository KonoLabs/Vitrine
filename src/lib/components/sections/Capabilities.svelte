<script lang="ts">
  // Core engineering disciplines (business data)
  const disciplines = [
    {
      code: "01 // PCB_HW",
      stack: "KICAD / GERBER / SMT",
      title: "CUSTOM PCB & HARDWARE",
      description:
        "Complete hardware design from concept to factory floor. High-speed impedance-controlled routing, power regulation, sensor matrices, and custom SoC carrier boards.",
      bullets: [
        "2 to 10 Layer FR-4 & Rigid-Flex",
        "High-Speed USB / MIPI / Ethernet Routing",
        "Full BOM Optimization & PCBA Bring-Up",
        "3D-Printed Enclosures & Mechanical Fit"
      ]
    },
    {
      code: "02 // EMB_FW",
      stack: "MCU / SOC / RTOS",
      title: "EMBEDDED FIRMWARE",
      description:
        "Deterministic, low-latency C/C++ and Rust firmware, vendor-agnostic. We write custom drivers, DMA pipelines and ultra-fast bootloaders for any microcontroller or embedded Linux SoC.",
      bullets: [
        "ARM Cortex-M / Xtensa / RISC-V Bring-Up",
        "ESP32, STM32, Luckfox RV1103 / RV1106 & Peers",
        "SPI / I2C / CAN / Modbus / RS-485",
        "Edge NPU Inference & Camera ISP Tuning"
      ]
    },
    {
      code: "03 // SYS_SW",
      stack: "LINUX / GO / RUST / C",
      title: "SOFTWARE & SERVICES",
      description:
        "Unix philosophy applied to production software, not just the kernel. Self-contained binaries, backend services and APIs, kernel modules when needed, custom network protocols and high-frequency telemetry backends.",
      bullets: [
        "Single-Binary Daemons & Systemd Units",
        "Backend APIs: TCP/UDP, MQTT, WebSockets, REST",
        "Alpine / Void Linux Appliances",
        "Web Dashboards, Control Interfaces & Tooling"
      ]
    },
    {
      code: "04 // WEB_BE",
      stack: "BACKEND / WEB / TS",
      title: "BACKEND & WEBSITES",
      description:
        "The rest of the stack, to the same standard: production backend services, databases and APIs — plus marketing sites, dashboards and full web applications, designed and shipped in-house.",
      bullets: [
        "Backend Services & APIs in Go, Rust, TypeScript",
        "Postgres / SQLite Databases & Data Modeling",
        "SvelteKit / Tailwind Websites & Dashboards",
        "CI/CD, Hosting & Observability"
      ]
    }
  ];
</script>

<!-- SECTION 03: CORE ENGINEERING DISCIPLINES (SWISS GRID) -->
<section id="capabilities" class="space-y-10">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="md:col-span-4">
      <span class="text-xs text-[#86A881] uppercase tracking-widest">03 // SPECIFICATION MATRIX</span>
      <h2 class="text-2xl md:text-3xl uppercase mt-2">END-TO-END ENGINEERING</h2>
    </div>
    <div class="md:col-span-8 text-xs md:text-sm text-[#FFFFFF]/70 flex items-end">
      Every layer of the stack is built in-house: from custom schematic capture and multi-layer PCB
      layout to board bring-up, firmware, daemons, backend services, and the websites and
      dashboards that sit on top.
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {#each disciplines as discipline}
      <div class="bg-[#353535] p-8 flex flex-col justify-between group hover:bg-[#404040]">
        <div>
          <span class="bg-[#86A881] text-[#000000] px-2.5 py-1 text-xs font-bold inline-block mb-8"
            >{discipline.code}</span
          >
          <h3 class="text-xl uppercase mb-4">{discipline.title}</h3>
          <p class="text-xs text-[#FFFFFF]/75 leading-relaxed mb-8">{discipline.description}</p>
        </div>
        <div>
          <div class="bg-[#000000] p-5 space-y-2 text-xs">
            {#each discipline.bullets as bullet, i}
              <div class={i === 0 ? "text-[#86A881]" : "text-[#FFFFFF]"}>+ {bullet}</div>
            {/each}
          </div>
          <div class="mt-4 text-[10px] uppercase tracking-widest text-[#86A881]">
            {discipline.stack}
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
