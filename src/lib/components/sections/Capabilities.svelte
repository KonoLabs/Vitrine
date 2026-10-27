<script lang="ts">
  const disciplines = [
    {
      code: "HARDWARE",
      stack: "SCHEMATIC · PCB · ASSEMBLY",
      title: "CUSTOM PCB & HARDWARE",
      description:
        "The physical product: the schematic, the board layout and a first working sample on your desk. Power, sensors, connectors and enclosure fit are all handled, along with the files the factory needs to build it.",
      bullets: [
        "Boards from 2 layers up to complex multilayer designs",
        "Fast signals routed cleanly so nothing misbehaves",
        "Parts chosen for price and availability, then sourced",
        "First samples tested by hand before the run starts",
      ],
    },
    {
      code: "FIRMWARE",
      stack: "MCU · SOC · REAL-TIME",
      title: "EMBEDDED FIRMWARE",
      description:
        "The code that lives on the chip itself. It has to start fast, never crash and keep running for years, so we write it for whichever processor fits your budget and your product.",
      bullets: [
        "New boards powered up and tested circuit by circuit",
        "ESP32, STM32, Luckfox and comparable chips",
        "Speaks to your sensors, motors and machines",
        "Vision or audio on the device, when it must not reach the cloud",
      ],
    },
    {
      code: "SOFTWARE",
      stack: "LINUX · SERVICES · APIS",
      title: "SOFTWARE & SERVICES",
      description:
        "What runs next to the device: small self-contained programs that collect, store and pass on what your hardware reports. Built to run unattended, on a server or directly on the board.",
      bullets: [
        "Single-file programs that install in one command",
        "Connections over MQTT, WebSockets, REST or plain TCP",
        "Lightweight servers that need little maintenance",
        "Dashboards, control panels and internal tools",
      ],
    },
    {
      code: "WEB & BACKEND",
      stack: "WEB · APIS · DATABASES",
      title: "BACKEND & WEBSITES",
      description:
        "The side people actually see: the website, the dashboard and the services behind them, designed and shipped by the same team as the hardware.",
      bullets: [
        "Backends in Go, Rust or TypeScript",
        "Postgres / SQLite databases and data modelling",
        "SvelteKit / Tailwind sites and dashboards",
        "Hosting, updates and monitoring set up for you",
      ],
    },
  ];
</script>

<section id="capabilities" class="space-y-10">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="md:col-span-4">
      <div class="text-xs text-[#88A888] uppercase tracking-widest">
        WHAT WE DO
      </div>
      <h2 class="text-2xl md:text-3xl uppercase mt-2">
        END-TO-END ENGINEERING
      </h2>
    </div>
    <div
      class="md:col-span-8 text-xs md:text-sm text-[#FFFFFF] flex items-end"
    >
      Everything is built under one roof: the circuit board, the code running on
      it, the servers behind it and the website on top - no hand-offs between
      five different contractors.
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {#each disciplines as discipline}
      <div
        class="bg-surface p-8 flex flex-col justify-between hover:bg-surface-hover transition-colors"
      >
        <div>
          <span
            class="text-xs text-[#88A888] uppercase tracking-widest block mb-4"
            >{discipline.code}</span
          >
          <h3 class="text-xl uppercase mb-3 text-[#FFFFFF]">
            {discipline.title}
          </h3>
          <p class="text-xs text-[#FFFFFF]/75 leading-relaxed mb-6">
            {discipline.description}
          </p>
          <div class="space-y-2 text-xs text-[#88A888]">
            {#each discipline.bullets as bullet}
              <div>+ {bullet}</div>
            {/each}
          </div>
        </div>
        <div
          class="mt-8 pt-4 border-t border-border text-[10px] uppercase tracking-widest text-[#FFFFFF]/50"
        >
          {discipline.stack}
        </div>
      </div>
    {/each}
  </div>

  <div
    class="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-6 text-xs text-[#FFFFFF]/70"
  >
    <span class="text-[10px] uppercase tracking-widest text-[#88A888]"
      >OPEN SOURCE ·</span
    >
    <a
      href="https://github.com/KonoLabs"
      class="inline-flex items-center gap-2 text-[#FFFFFF] no-underline hover:text-[#88A888]"
    >
      <svg viewBox="0 0 16 16" class="w-4 h-4 fill-current" aria-hidden="true"
        ><path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        /></svg
      >
      github.com/KonoLabs
    </a>
  </div>
</section>
