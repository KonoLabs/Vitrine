<script lang="ts">
import { onMount } from 'svelte';

// CAD Crosshair & Telemetry State
let mouseX = $state(0);
let mouseY = $state(0);
let tick = $state(0);
let clockSpeed = $state(1); // 0 = paused, 1 = 10MHz, 2 = 40MHz, 4 = 80MHz

// Interactive Board / Target Selector
let selectedTarget = $state<'luckfox' | 'esp32' | 'linux'>('luckfox');

const targets = {
luckfox: {
code: 'SOC_RV1106_G3',
      name: 'LUCKFOX PICO // ROCKCHIP RV1106',
      arch: 'ARM Cortex-A7 + RISC-V MCU + 1.0 TOPS NPU',
      clock: '1.2 GHz / 250 MHz',
      mem: '256MB DDR3L / SPI NAND',
      os: 'Custom Buildroot / BusyBox / Minimal Linux 5.10',
      registers: [
      { addr: '0xFF00_0000', reg: 'GRF_GPIO1B_IOMUX', val: '0x0000_1144', desc: 'UART3 + MIPI-CSI' },
      { addr: '0xFF32_0040', reg: 'SPI0_CTRLR0', val: '0x001F_01C7', desc: 'DMA MASTER 50MHz' },
      { addr: '0xFF65_0100', reg: 'NPU_PWR_STAT', val: '0x0000_0001', desc: 'INT8 CORE ONLINE' },
      { addr: '0xFF10_0008', reg: 'PWM1_PERIOD_HPR', val: '0x0000_03E8', desc: '100KHz CARRIER' }
      ],
      pins: [
      { pin: '01', name: 'VCC_3V3', type: 'PWR', active: true },
      { pin: '02', name: 'GND', type: 'GND', active: false },
      { pin: '03', name: 'I2C3_SDA', type: 'IO', active: true },
      { pin: '04', name: 'I2C3_SCL', type: 'IO', active: true },
      { pin: '05', name: 'UART2_TX', type: 'DBG', active: true },
      { pin: '06', name: 'UART2_RX', type: 'DBG', active: true },
      { pin: '07', name: 'SPI0_CLK', type: 'BUS', active: true },
      { pin: '08', name: 'SPI0_MOSI', type: 'BUS', active: true },
      { pin: '09', name: 'SPI0_CS0', type: 'BUS', active: false },
      { pin: '10', name: 'PWM0_M0', type: 'PWM', active: true },
      { pin: '11', name: 'ADC_IN0', type: 'ANA', active: true },
      { pin: '12', name: 'RMII_CLK', type: 'ETH', active: true }
      ]
         },
esp32: {
code: 'MCU_ESP32_S3',
      name: 'ESP32-S3 // DUAL-CORE XTENSA LX7',
      arch: 'Dual Xtensa LX7 + ULP RISC-V Co-Processor',
      clock: '240 MHz',
      mem: '512KB SRAM / 8MB Octal PSRAM / 16MB Flash',
      os: 'ESP-IDF v5.x Bare-Metal / FreeRTOS SMP',
      registers: [
      { addr: '0x6000_4004', reg: 'GPIO_OUT_W1TS', val: '0x0004_0010', desc: 'DIRECT ATOMIC SET' },
      { addr: '0x6002_5000', reg: 'SPI2_CMD_REG', val: '0x0004_0000', desc: 'OCTAL DMA TX' },
      { addr: '0x6001_3000', reg: 'TWAI_MODE_REG', val: '0x0000_0000', desc: 'CAN BUS 1MBIT/S' },
      { addr: '0x6000_8000', reg: 'RTC_CNTL_OPTIONS0', val: '0x1C00_2000', desc: 'DEEP SLEEP WAKE' }
      ],
      pins: [
      { pin: '01', name: 'VDD_3P3', type: 'PWR', active: true },
      { pin: '02', name: 'IO0_BOOT', type: 'SYS', active: false },
      { pin: '03', name: 'TWAI_TX', type: 'CAN', active: true },
      { pin: '04', name: 'TWAI_RX', type: 'CAN', active: true },
      { pin: '05', name: 'I2S_BCLK', type: 'AUD', active: true },
      { pin: '06', name: 'I2S_DOUT', type: 'AUD', active: true },
      { pin: '07', name: 'USB_D-', type: 'USB', active: true },
      { pin: '08', name: 'USB_D+', type: 'USB', active: true },
      { pin: '09', name: 'QPSI_CS', type: 'MEM', active: true },
      { pin: '10', name: 'RMT_CH0', type: 'SIG', active: true },
      { pin: '11', name: 'TOUCH_1', type: 'CAP', active: false },
      { pin: '12', name: 'GND_PAD', type: 'GND', active: false }
      ]
       },
linux: {
code: 'SYS_LINUX_ELF',
      name: 'BARE-METAL LINUX // DAEMONS & KERNEL',
      arch: 'x86_64 / AArch64 / RISC-V64 Static ELF',
      clock: 'NO RUNTIME / ZERO GC / IO_URING',
      mem: '< 4MB RSS Footprint / Lock-Free Ringbuffers',
      os: 'Alpine / Void / Custom Kernel 6.12 LTS',
      registers: [
      { addr: 'SYS_0x01AA', reg: 'io_uring_setup', val: 'SQPOLL | IOPOLL', desc: 'ZERO-SYSCALL I/O' },
      { addr: 'SYS_0x0119', reg: 'epoll_pwait2', val: 'NANO_TIMEOUT', desc: 'SOCKET MULTIPLEX' },
      { addr: 'BPF_0x0024', reg: 'XDP_DRV_MODE', val: 'XDP_DROP/PASS', desc: 'NIC WIRE-SPEED' },
      { addr: 'MEM_0x0009', reg: 'mmap_hugepage', val: 'MAP_LOCKED', desc: 'ZERO PAGE FAULTS' }
      ],
      pins: [
      { pin: 'FD0', name: 'STDIN_RAW', type: 'FD', active: false },
      { pin: 'FD1', name: 'STDOUT_LOG', type: 'FD', active: true },
      { pin: 'FD3', name: 'URING_RING', type: 'KRN', active: true },
      { pin: 'FD4', name: 'AF_XDP_SK', type: 'NET', active: true },
      { pin: 'FD5', name: 'NETLINK_RT', type: 'KRN', active: true },
      { pin: 'FD6', name: 'TIMERFD_0', type: 'CLK', active: true },
      { pin: 'FD7', name: 'SIGNALFD', type: 'IPC', active: false },
      { pin: 'FD8', name: 'MEMFD_SHM', type: 'DMA', active: true },
      { pin: 'FD9', name: 'DRM_KMS', type: 'GPU', active: true },
      { pin: 'FDA', name: 'GPIO_CDEV', type: 'HW', active: true },
      { pin: 'FDB', name: 'SPIDEV0.0', type: 'HW', active: true },
      { pin: 'FDC', name: 'I2C_DEV_1', type: 'HW', active: true }
      ]
       }
};

// Logic Analyzer Channels
const channels = [
{ name: 'CH0 // SPI_CLK', freq: 1, duty: 0.5 },
{ name: 'CH1 // SPI_MOSI', freq: 0.35, duty: 0.6 },
{ name: 'CH2 // SPI_MISO', freq: 0.6, duty: 0.3 },
{ name: 'CH3 // UART_TX', freq: 0.25, duty: 0.75 },
{ name: 'CH4 // NPU_IRQ', freq: 0.12, duty: 0.15 }
];

// Build SVG square wave path dynamically
function getWavePath(chIndex: number, currentTick: number, freq: number, duty: number): string {
    const steps = 36;
    const stepWidth = 24;
    let d = `M 0 28`;
    let prevY = 28;

    for (let i = 0; i <= steps; i++) {
        const phase = ((i + Math.floor(currentTick * freq)) * (chIndex + 3)) % 10;
        const high = (phase / 10) < duty;
        const y = high ? 6 : 28;
        const x = i * stepWidth;
        if (i > 0 && y !== prevY) {
            d += ` L ${x} ${prevY} L ${x} ${y}`;
        } else {
            d += ` L ${x} ${y}`;
        }
        prevY = y;
    }
    return d;
}

onMount(() => {
        const waveInterval = setInterval(() => {
                if (clockSpeed > 0) {
                tick += clockSpeed;
                }
                }, 90);

        return () => {
        clearInterval(waveInterval);
        };
        });
</script>

<svelte:window
onmousemove={(e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}}
/>

<svelte:head>
<title>KONO // HARDWARE, FIRMWARE & LOW-LEVEL SYSTEMS</title>
</svelte:head>

<div class="relative min-h-screen bg-[#000000] text-[#FFFFFF] font-['undefined',monospace] selection:bg-[#86A881] selection:text-[#000000] overflow-x-hidden antialiased">

<!-- Dual-Scale Blueprint Grid Background -->
<div class="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#353535_1px,transparent_1px),linear-gradient(to_bottom,#353535_1px,transparent_1px)] bg-[size:16px_16px]"></div>
<div class="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#86A881_1px,transparent_1px),linear-gradient(to_bottom,#86A881_1px,transparent_1px)] bg-[size:96px_96px]"></div>

<!-- Interactive CAD Crosshair Overlay -->
<div class="fixed inset-0 pointer-events-none z-40 hidden lg:block">
<!-- Horizontal Axis Line -->
<div
class="absolute left-0 right-0 h-[1px] bg-[#86A881]/30"
style="top: {mouseY}px;"
></div>
<!-- Vertical Axis Line -->
<div
class="absolute top-0 bottom-0 w-[1px] bg-[#86A881]/30"
style="left: {mouseX}px;"
></div>
<!-- Cursor Coordinate Readout Box -->
<div
class="absolute bg-[#000000] text-[#86A881] px-2 py-1 text-[10px] tracking-widest whitespace-nowrap"
style="left: {mouseX + 12}px; top: {mouseY + 12}px;"
>
X:{mouseX.toString().padStart(4, '0')} Y:{mouseY.toString().padStart(4, '0')} // 0x{(mouseX ^ mouseY).toString(16).toUpperCase().padStart(4, '0')}
</div>
</div>

<!-- Top Sticky Telemetry Ribbon -->
<div class="sticky top-0 z-30 bg-[#000000] px-6 md:px-12 py-3">
<div class="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-widest">
<div class="flex items-center gap-4">
<img src="/logo-transparent-bg.png" alt="KONO" class="h-6 w-auto" />
<span class="bg-[#86A881] text-[#000000] px-2 py-0.5 font-bold">KONO_LABS</span>
</div>

<div class="flex items-center gap-6">
<a href="#inspector" class="hover:bg-[#86A881] hover:text-[#000000] px-2 py-0.5">01.SILICON</a>
<a href="#analyzer" class="hover:bg-[#86A881] hover:text-[#000000] px-2 py-0.5">02.SIGNALS</a>
<a href="#capabilities" class="hover:bg-[#86A881] hover:text-[#000000] px-2 py-0.5">03.DISCIPLINES</a>
<a href="#terminal" class="bg-[#86A881] text-[#000000] px-3 py-0.5 hover:bg-[#FFFFFF]">INIT_TX</a>
</div>
</div>
</div>

<main class="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-8 pb-24 space-y-24 md:space-y-36">

<!-- HERO SECTION: Asymmetric Swiss Layout + Animated PCB Schematic -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
<!-- Left Column: Manifesto & Direct Callouts -->
<div class="lg:col-span-7 flex flex-col justify-between space-y-8">
<div class="space-y-6">
<img src="/long-logo-transparent-bg.png" alt="KONO" class="h-10 md:h-14 w-auto" />
<div class="inline-flex items-center gap-3 bg-[#353535] px-3 py-1.5 text-xs text-[#86A881] uppercase tracking-widest">
<span>[SCHEMATIC REV 4.2]</span>
<span class="text-[#FFFFFF]">//</span>
<span class="text-[#FFFFFF]">SILICON TO KERNEL</span>
</div>

<h1 class="text-4xl sm:text-5xl xl:text-6xl leading-[1.08] uppercase tracking-tight">
CUSTOM <span class="bg-[#86A881] text-[#000000] px-2">PCB</span> HARDWARE, BARE-METAL <span class="text-[#86A881]">FIRMWARE</span> & LOW-LEVEL LINUX.
</h1>

<p class="text-sm md:text-base text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
Kono is a hardware and systems engineering foundry. We route multi-layer circuit boards, write deterministic firmware for <span class="text-[#86A881]">ESP32</span> and <span class="text-[#86A881]">Luckfox RV1106</span> SoCs, and ship static Linux binaries with zero dependency bloat.
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

<!-- Right Column: Animated SVG PCB Routing Blueprint -->
<div class="lg:col-span-5 bg-[#353535] p-6 flex flex-col justify-between relative overflow-hidden">
<div class="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#86A881] mb-4">
<span>CAD_VIEW // KONO-CARRIER-V4.KICAD_PCB</span>
</div>

<!-- Animated Vector PCB Schematic -->
<div class="bg-[#000000] p-4 my-auto">
<svg viewBox="0 0 400 320" class="w-full h-auto">
<!-- Background Grid Dots -->
<defs>
<pattern id="pcb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
<rect x="0" y="0" width="2" height="2" fill="#413B35" />
</pattern>
</defs>
<rect width="400" height="320" fill="url(#pcb-grid)" />

<!-- Copper Traces (Static Base) -->
<g stroke="#413B35" stroke-width="2.5" fill="none">
<path d="M 30 50 L 90 50 L 120 80 L 155 80" />
<path d="M 30 90 L 80 90 L 110 120 L 155 120" />
<path d="M 30 130 L 70 130 L 100 160 L 155 160" />
<path d="M 245 80 L 290 80 L 320 50 L 370 50" />
<path d="M 245 120 L 300 120 L 330 150 L 370 150" />
<path d="M 245 160 L 285 160 L 315 210 L 370 210" />
<path d="M 180 195 L 180 250 L 110 280 L 40 280" />
<path d="M 200 195 L 200 265 L 270 290 L 360 290" />
<path d="M 220 195 L 220 240 L 260 240 L 290 270" />
</g>

<!-- Animated High-Speed Signal Pulses on Traces -->
<g stroke="#86A881" stroke-width="2.5" fill="none" stroke-dasharray="14 120" class="pcb-pulse">
<path d="M 30 50 L 90 50 L 120 80 L 155 80" />
<path d="M 30 90 L 80 90 L 110 120 L 155 120" />
<path d="M 245 80 L 290 80 L 320 50 L 370 50" />
<path d="M 245 120 L 300 120 L 330 150 L 370 150" />
<path d="M 180 195 L 180 250 L 110 280 L 40 280" />
<path d="M 200 195 L 200 265 L 270 290 L 360 290" />
</g>

<!-- BGA / QFN Main SoC Package in Center -->
<rect x="155" y="65" width="90" height="90" fill="#353535" />
<rect x="165" y="75" width="70" height="70" fill="#000000" />
<!-- Pin 1 Indicator -->
<rect x="170" y="80" width="6" height="6" fill="#86A881" class="animate-ping" />
<text x="172" y="115" fill="#86A881" font-size="9" font-family="monospace">RV1106</text>
<text x="172" y="130" fill="#FFFFFF" font-size="7" font-family="monospace">KONO_CORE</text>

<!-- Secondary IC (SPI NAND / Transceiver) -->
<rect x="165" y="165" width="70" height="30" fill="#413B35" />
<text x="175" y="183" fill="#FFFFFF" font-size="8" font-family="monospace">W25Q128JV</text>

<!-- Via Pads & Test Points -->
{#each [
    [30, 50], [30, 90], [30, 130],
    [370, 50], [370, 150], [370, 210],
    [40, 280], [360, 290], [290, 270]
] as [cx, cy], idx}
<rect x={cx - 5} y={cy - 5} width="10" height="10" fill="#86A881" />
<rect x={cx - 2} y={cy - 2} width="4" height="4" fill="#000000" />
{#if idx % 2 === tick % 2}
<rect x={cx - 7} y={cy - 7} width="14" height="14" fill="none" stroke="#86A881" stroke-width="1" />
{/if}
{/each}
</svg>
</div>
</div>
</section>

<!-- SECTION 01: INTERACTIVE SILICON & REGISTER INSPECTOR -->
<section id="inspector" class="space-y-8">
<div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
<div class="md:col-span-4">
<div class="text-xs text-[#86A881] uppercase tracking-widest mb-2">01 // HARDWARE TARGETS</div>
<h2 class="text-2xl md:text-3xl uppercase">INTERACTIVE ARCHITECTURE INSPECTOR</h2>
</div>
<div class="md:col-span-8 flex flex-wrap gap-3 md:justify-end">
<button
onclick={() => (selectedTarget = 'luckfox')}
class="px-5 py-3 text-xs uppercase tracking-widest cursor-pointer {selectedTarget === 'luckfox' ? 'bg-[#86A881] text-[#000000]' : 'bg-[#353535] text-[#FFFFFF] hover:bg-[#413B35]'}"
>
[01] LUCKFOX RV1106
</button>
<button
onclick={() => (selectedTarget = 'esp32')}
class="px-5 py-3 text-xs uppercase tracking-widest cursor-pointer {selectedTarget === 'esp32' ? 'bg-[#86A881] text-[#000000]' : 'bg-[#353535] text-[#FFFFFF] hover:bg-[#413B35]'}"
>
[02] ESP32-S3 / C6
</button>
<button
onclick={() => (selectedTarget = 'linux')}
class="px-5 py-3 text-xs uppercase tracking-widest cursor-pointer {selectedTarget === 'linux' ? 'bg-[#86A881] text-[#000000]' : 'bg-[#353535] text-[#FFFFFF] hover:bg-[#413B35]'}"
>
[03] LINUX DAEMON / ELF
</button>
</div>
</div>

<!-- Active Target Datasheet Panel -->
{#key selectedTarget}
{@const target = targets[selectedTarget]}
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
<div class="grid grid-cols-12 gap-2 py-1.5 items-center {i % 2 === 0 ? 'bg-[#353535]/30' : ''} px-2">
<span class="col-span-3 text-[#86A881]">{reg.addr}</span>
<span class="col-span-4 text-[#FFFFFF]">{reg.reg}</span>
<span class="col-span-2 text-[#86A881]">{reg.val}</span>
<span class="col-span-3 text-[#FFFFFF]/60 text-right">{reg.desc}</span>
</div>
{/each}
</div>
</div>
</div>

<!-- Pinout / Bus Multiplexer Matrix -->
<div class="lg:col-span-5 bg-[#413B35] p-6 md:p-8 flex flex-col justify-between">
<div>
<div class="flex justify-between items-center mb-6">
<span class="text-xs text-[#86A881] uppercase tracking-widest">PINOUT / IO MATRIX</span>
<span class="text-[10px] bg-[#000000] text-[#FFFFFF] px-2 py-1">3.3V CMOS LOGIC</span>
</div>

<div class="grid grid-cols-2 gap-3">
{#each target.pins as p, idx}
{@const pulsing = p.active && ((tick + idx) % 3 === 0)}
<div class="bg-[#000000] p-3 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 inline-block {pulsing ? 'bg-[#86A881]' : p.active ? 'bg-[#86A881]/40' : 'bg-[#353535]'}"></span>
<span class="text-xs text-[#FFFFFF]">{p.name}</span>
</div>
<div class="flex items-center gap-2">
<span class="text-[10px] text-[#86A881] bg-[#353535] px-1.5 py-0.5">{p.type}</span>
<span class="text-[10px] text-[#FFFFFF]/40">{p.pin}</span>
</div>
</div>
{/each}
</div>
</div>

<div class="mt-6 bg-[#000000] p-3 text-[11px] text-[#86A881] flex justify-between">
<span>OS_ENV: {target.os}</span>
<span>[LOCKED]</span>
</div>
</div>
</div>
{/key}
</section>

<!-- SECTION 02: LIVE 5-CHANNEL LOGIC ANALYZER -->
<section id="analyzer" class="bg-[#353535] p-6 md:p-10 space-y-6">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<div class="text-xs text-[#86A881] uppercase tracking-widest">02 // REAL-TIME TELEMETRY</div>
<h2 class="text-xl md:text-2xl uppercase mt-1">HARDWARE LOGIC ANALYZER // BUS CAPTURE</h2>
</div>

<div class="flex flex-wrap items-center gap-2 text-xs">
<span class="text-[#FFFFFF]/60 mr-2">SAMPLE_RATE:</span>
<button
onclick={() => (clockSpeed = 0)}
class="px-3 py-1.5 uppercase cursor-pointer {clockSpeed === 0 ? 'bg-[#86A881] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'}"
>
HALT
</button>
<button
onclick={() => (clockSpeed = 1)}
class="px-3 py-1.5 uppercase cursor-pointer {clockSpeed === 1 ? 'bg-[#86A881] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'}"
>
10MHz
</button>
<button
onclick={() => (clockSpeed = 2)}
class="px-3 py-1.5 uppercase cursor-pointer {clockSpeed === 2 ? 'bg-[#86A881] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'}"
>
40MHz
</button>
<button
onclick={() => (clockSpeed = 4)}
class="px-3 py-1.5 uppercase cursor-pointer {clockSpeed === 4 ? 'bg-[#86A881] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'}"
>
80MHz
</button>
</div>
</div>

<div class="bg-[#000000] p-4 md:p-6 space-y-4">
{#each channels as ch, idx}
<div class="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
<div class="md:col-span-3 flex items-center justify-between pr-4">
<span class="text-xs text-[#86A881]">{ch.name}</span>
<span class="text-[10px] bg-[#413B35] text-[#FFFFFF] px-1.5 py-0.5">
{((tick + idx) % 2 === 0) ? 'HIGH 3V3' : 'LOW 0V0'}
</span>
</div>
<div class="md:col-span-9 bg-[#353535]/25 p-1 overflow-hidden">
<svg viewBox="0 0 860 34" class="w-full h-7 overflow-visible">
<path
d={getWavePath(idx, tick, ch.freq, ch.duty)}
fill="none"
stroke="#86A881"
stroke-width="2"
/>
</svg>
</div>
</div>
{/each}
</div>
</section>

<!-- SECTION 03: CORE ENGINEERING DISCIPLINES (SWISS GRID) -->
<section id="capabilities" class="space-y-10">
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<div class="md:col-span-4">
<span class="text-xs text-[#86A881] uppercase tracking-widest">03 // SPECIFICATION MATRIX</span>
<h2 class="text-2xl md:text-3xl uppercase mt-2">END-TO-END ENGINEERING</h2>
</div>
<div class="md:col-span-8 text-xs md:text-sm text-[#FFFFFF]/70 flex items-end">
Every layer of the stack is built in-house: from custom schematic capture and multi-layer PCB layout to board bring-up, microcontroller firmware, and bare-metal Linux daemons.
</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Card 1 -->
<div class="bg-[#353535] p-8 flex flex-col justify-between group hover:bg-[#413B35]">
<div>
<div class="flex justify-between items-center mb-8">
<span class="bg-[#86A881] text-[#000000] px-2.5 py-1 text-xs font-bold">01 // PCB_HW</span>
<span class="text-xs text-[#86A881]">KICAD / GERBER / SMT</span>
</div>
<h3 class="text-xl uppercase mb-4">CUSTOM PCB &amp; HARDWARE</h3>
<p class="text-xs text-[#FFFFFF]/75 leading-relaxed mb-8">
Complete hardware design from concept to factory floor. High-speed impedance-controlled routing, power regulation, sensor matrices, and custom SoC carrier boards.
</p>
</div>
<div class="bg-[#000000] p-5 space-y-2 text-xs">
<div class="text-[#86A881]">+ 2 to 10 Layer FR-4 &amp; Rigid-Flex</div>
<div class="text-[#FFFFFF]">+ High-Speed USB / MIPI / Ethernet Routing</div>
<div class="text-[#FFFFFF]">+ Full BOM Optimization &amp; PCBA Bring-Up</div>
<div class="text-[#FFFFFF]">+ 3D-Printed Enclosures &amp; Mechanical Fit</div>
</div>
</div>

<!-- Card 2 -->
<div class="bg-[#353535] p-8 flex flex-col justify-between group hover:bg-[#413B35]">
<div>
<div class="flex justify-between items-center mb-8">
<span class="bg-[#86A881] text-[#000000] px-2.5 py-1 text-xs font-bold">02 // EMB_FW</span>
<span class="text-xs text-[#86A881]">ESP32 / LUCKFOX / RTOS</span>
</div>
<h3 class="text-xl uppercase mb-4">EMBEDDED FIRMWARE</h3>
<p class="text-xs text-[#FFFFFF]/75 leading-relaxed mb-8">
Deterministic, low-latency C/C++ and Rust firmware. We write custom drivers, DMA pipelines, and ultra-fast bootloaders for microcontrollers and embedded Linux SoCs.
</p>
</div>
<div class="bg-[#000000] p-5 space-y-2 text-xs">
<div class="text-[#86A881]">+ ESP32-S3 / C3 / C6 (ESP-IDF Bare-Metal)</div>
<div class="text-[#FFFFFF]">+ Luckfox Pico RV1103 / RV1106 Buildroot</div>
<div class="text-[#FFFFFF]">+ SPI / I2C / CAN / Modbus / RS-485</div>
<div class="text-[#FFFFFF]">+ Edge NPU Inference &amp; Camera ISP Tuning</div>
</div>
</div>

<!-- Card 3 -->
<div class="bg-[#353535] p-8 flex flex-col justify-between group hover:bg-[#413B35]">
<div>
<div class="flex justify-between items-center mb-8">
<span class="bg-[#86A881] text-[#000000] px-2.5 py-1 text-xs font-bold">03 // SYS_SW</span>
<span class="text-xs text-[#86A881]">LINUX / GO / RUST / C</span>
</div>
<h3 class="text-xl uppercase mb-4">LOW-LEVEL SOFTWARE</h3>
<p class="text-xs text-[#FFFFFF]/75 leading-relaxed mb-8">
Unix philosophy applied to production software. Self-contained static binaries, kernel modules, custom network protocols, and high-frequency telemetry backends.
</p>
</div>
<div class="bg-[#000000] p-5 space-y-2 text-xs">
<div class="text-[#86A881]">+ Single-Binary Daemons &amp; Systemd Units</div>
<div class="text-[#FFFFFF]">+ Raw TCP/UDP, MQTT, WebSockets</div>
<div class="text-[#FFFFFF]">+ Alpine / Void Linux Appliances</div>
<div class="text-[#FFFFFF]">+ Zero-Bloat Control Interfaces</div>
</div>
</div>
</div>
</section>

<!-- SECTION 04: INITIALIZE PROJECT & CONTACT -->
<section id="terminal">
<!-- Initiation / Contact Block -->
<div class="bg-[#86A881] text-[#000000] p-8 md:p-10 flex flex-col justify-between space-y-8">
<div class="space-y-4">
<div class="inline-block bg-[#000000] text-[#86A881] px-3 py-1 text-xs uppercase tracking-widest">
04 // INITIALIZE PROJECT
</div>
<h2 class="text-2xl md:text-4xl uppercase leading-tight">
BUILD REAL HARDWARE &amp; FAST SOFTWARE.
</h2>
<p class="text-xs md:text-sm leading-relaxed text-[#000000]/80">
Direct access to the engineers writing your C/Rust/Go code and routing your PCB traces. Send your specs, block diagrams, or repository links.
</p>
</div>

<div class="space-y-3">
<a
href="mailto:contact@kono.sh"
class="block w-full bg-[#000000] text-[#FFFFFF] hover:bg-[#353535] p-4 text-xs uppercase tracking-widest text-center"
>
&gt; MAILTO: CONTACT@KONO.SH
</a>
</div>
</div>
</section>

<!-- Footer -->
<footer class="bg-[#353535] p-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs uppercase tracking-widest">
<div class="md:col-span-4 text-[#86A881]">
KONO // SOFTWARE &amp; HARDWARE FOUNDRY
</div>
<div class="md:col-span-4 text-[#FFFFFF]/60">
0px RADIUS // 0px BORDER // 100% NATIVE
</div>
<div class="md:col-span-4 md:text-right text-[#FFFFFF]">
© {new Date().getFullYear()} KONO
</div>
</footer>

</main>
</div>

<style>
@keyframes dashFlow {
    to {
        stroke-dashoffset: -268;
    }
}
.pcb-pulse {
animation: dashFlow 3.2s linear infinite;
}
</style>
