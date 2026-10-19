<script lang="ts">
  type TargetKey = "luckfox" | "esp32" | "linux";

  interface Register {
    addr: string;
    reg: string;
    val: string;
    desc: string;
  }

  interface Target {
    code: string;
    name: string;
    arch: string;
    clock: string;
    mem: string;
    os: string;
    registers: Register[];
  }

  const targets: Record<TargetKey, Target> = {
    luckfox: {
      code: "SOC_RV1106_G3",
      name: "LUCKFOX PICO // ROCKCHIP RV1106",
      arch: "ARM Cortex-A7 + RISC-V MCU + 1.0 TOPS NPU",
      clock: "1.2 GHz / 250 MHz",
      mem: "256MB DDR3L / SPI NAND",
      os: "Custom Buildroot / BusyBox / Minimal Linux 5.10",
      registers: [
        { addr: "0xFF00_0000", reg: "GRF_GPIO1B_IOMUX", val: "0x0000_1144", desc: "UART3 + MIPI-CSI" },
        { addr: "0xFF32_0040", reg: "SPI0_CTRLR0", val: "0x001F_01C7", desc: "DMA MASTER 50MHz" },
        { addr: "0xFF65_0100", reg: "NPU_PWR_STAT", val: "0x0000_0001", desc: "INT8 CORE ONLINE" },
        { addr: "0xFF10_0008", reg: "PWM1_PERIOD_HPR", val: "0x0000_03E8", desc: "100KHz CARRIER" }
      ]
    },
    esp32: {
      code: "MCU_ESP32_S3",
      name: "ESP32-S3 // DUAL-CORE XTENSA LX7",
      arch: "Dual Xtensa LX7 + ULP RISC-V Co-Processor",
      clock: "240 MHz",
      mem: "512KB SRAM / 8MB Octal PSRAM / 16MB Flash",
      os: "ESP-IDF v5.x Bare-Metal / FreeRTOS SMP",
      registers: [
        { addr: "0x6000_4004", reg: "GPIO_OUT_W1TS", val: "0x0004_0010", desc: "DIRECT ATOMIC SET" },
        { addr: "0x6002_5000", reg: "SPI2_CMD_REG", val: "0x0004_0000", desc: "OCTAL DMA TX" },
        { addr: "0x6001_3000", reg: "TWAI_MODE_REG", val: "0x0000_0000", desc: "CAN BUS 1MBIT/S" },
        { addr: "0x6000_8000", reg: "RTC_CNTL_OPTIONS0", val: "0x1C00_2000", desc: "DEEP SLEEP WAKE" }
      ]
    },
    linux: {
      code: "SYS_LINUX_ELF",
      name: "LINUX SYSTEMS // DAEMONS, SERVICES & KERNEL",
      arch: "x86_64 / AArch64 / RISC-V64 Static ELF",
      clock: "NO RUNTIME / ZERO GC / IO_URING",
      mem: "< 4MB RSS Footprint / Lock-Free Ringbuffers",
      os: "Alpine / Void / Custom Kernel 6.12 LTS",
      registers: [
        { addr: "SYS_0x01AA", reg: "io_uring_setup", val: "SQPOLL | IOPOLL", desc: "ZERO-SYSCALL I/O" },
        { addr: "SYS_0x0119", reg: "epoll_pwait2", val: "NANO_TIMEOUT", desc: "SOCKET MULTIPLEX" },
        { addr: "BPF_0x0024", reg: "XDP_DRV_MODE", val: "XDP_DROP/PASS", desc: "NIC WIRE-SPEED" },
        { addr: "MEM_0x0009", reg: "mmap_hugepage", val: "MAP_LOCKED", desc: "ZERO PAGE FAULTS" }
      ]
    }
  };

  const tabs: { key: TargetKey; label: string }[] = [
    { key: "luckfox", label: "[01] LUCKFOX RV1106" },
    { key: "esp32", label: "[02] ESP32-S3 / C6" },
    { key: "linux", label: "[03] LINUX SERVICE / ELF" }
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

<!-- SECTION 01: INTERACTIVE SILICON & REGISTER INSPECTOR -->
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
              : 'bg-[#353535] text-[#FFFFFF] hover:bg-[#413B35]'}"
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
      <!-- Target Specs & Live Register Dump -->
      <div class="lg:col-span-7 bg-[#353535] p-6 md:p-8 space-y-6">
        <div class="flex flex-wrap justify-between items-center gap-2 bg-[#000000] p-4">
          <div>
            <span class="text-[10px] text-[#86A881] block">TARGET_ID // {target.code}</span>
            <h3 class="text-lg md:text-xl text-[#FFFFFF] uppercase">{target.name}</h3>
          </div>
          <span class="bg-[#86A881] text-[#000000] px-2 py-1 text-xs uppercase">ACTIVE_PROBE</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="bg-[#413B35] p-4">
            <span class="text-[10px] text-[#86A881] block mb-1">CORE ARCH</span>
            <span>{target.arch}</span>
          </div>
          <div class="bg-[#413B35] p-4">
            <span class="text-[10px] text-[#86A881] block mb-1">CLOCK / TIMING</span>
            <span>{target.clock}</span>
          </div>
          <div class="bg-[#413B35] p-4">
            <span class="text-[10px] text-[#86A881] block mb-1">MEMORY / RUNTIME</span>
            <span>{target.mem}</span>
          </div>
        </div>

        <!-- Live Register Table -->
        <div class="space-y-2">
          <div class="text-[10px] text-[#86A881] uppercase tracking-widest">
            MMIO REGISTER &amp; SYSCALL MONITOR
          </div>
          <div class="bg-[#000000] p-4 space-y-2 text-xs overflow-x-auto">
            {#each target.registers as reg, i}
              <div
                class="grid grid-cols-12 gap-2 py-1.5 items-center {i % 2 === 0
                  ? 'bg-[#353535]/30'
                  : ''} px-2"
              >
                <span class="col-span-3 text-[#86A881]">{reg.addr}</span>
                <span class="col-span-4 text-[#FFFFFF]">{reg.reg}</span>
                <span class="col-span-2 text-[#86A881]">{reg.val}</span>
                <span class="col-span-3 text-[#FFFFFF]/60 text-right">{reg.desc}</span>
              </div>
            {/each}
          </div>

          <div class="flex justify-between gap-4 text-[10px] text-[#86A881] uppercase tracking-widest">
            <span>OS_ENV: {target.os}</span>
            <span>[LOCKED]</span>
          </div>
        </div>
      </div>
    {/key}

    <!-- Engagement / Business Panel -->
    <div class="lg:col-span-5 bg-[#413B35] p-6 md:p-8 flex flex-col justify-between">
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
