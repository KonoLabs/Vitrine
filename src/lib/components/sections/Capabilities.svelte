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
      stack: "ESP32 / LUCKFOX / RTOS",
      title: "EMBEDDED FIRMWARE",
      description:
        "Deterministic, low-latency C/C++ and Rust firmware. We write custom drivers, DMA pipelines, and ultra-fast bootloaders for microcontrollers and embedded Linux SoCs.",
      bullets: [
        "ESP32-S3 / C3 / C6 (ESP-IDF Bare-Metal)",
        "Luckfox Pico RV1103 / RV1106 Buildroot",
        "SPI / I2C / CAN / Modbus / RS-485",
        "Edge NPU Inference & Camera ISP Tuning"
      ]
    },
    {
      code: "03 // SYS_SW",
      stack: "LINUX / GO / RUST / C",
      title: "LOW-LEVEL SOFTWARE",
      description:
        "Unix philosophy applied to production software. Self-contained static binaries, kernel modules, custom network protocols, and high-frequency telemetry backends.",
      bullets: [
        "Single-Binary Daemons & Systemd Units",
        "Raw TCP/UDP, MQTT, WebSockets",
        "Alpine / Void Linux Appliances",
        "Zero-Bloat Control Interfaces"
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
      layout to board bring-up, microcontroller firmware, and bare-metal Linux daemons.
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each disciplines as discipline}
      <div class="bg-[#353535] p-8 flex flex-col justify-between group hover:bg-[#413B35]">
        <div>
          <div class="flex justify-between items-center mb-8">
            <span class="bg-[#86A881] text-[#000000] px-2.5 py-1 text-xs font-bold"
              >{discipline.code}</span
            >
            <span class="text-xs text-[#86A881]">{discipline.stack}</span>
          </div>
          <h3 class="text-xl uppercase mb-4">{discipline.title}</h3>
          <p class="text-xs text-[#FFFFFF]/75 leading-relaxed mb-8">{discipline.description}</p>
        </div>
        <div class="bg-[#000000] p-5 space-y-2 text-xs">
          {#each discipline.bullets as bullet, i}
            <div class={i === 0 ? "text-[#86A881]" : "text-[#FFFFFF]"}>+ {bullet}</div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>
