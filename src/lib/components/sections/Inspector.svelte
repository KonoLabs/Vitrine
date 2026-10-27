<script lang="ts">
  import Icon from "@iconify/svelte";

  type ExampleKey = "camera" | "sensor";

  interface Example {
    name: string;
    summary: string;
    parts: { label: string; text: string }[];
    connects: string[];
    uses: string[];
  }

  const examples: Record<ExampleKey, Example> = {
    camera: {
      name: "A CAMERA THAT THINKS ON ITS OWN",
      summary:
        "A small board with a camera that recognises what it sees directly on the device. Nothing is sent to the cloud, so the footage never leaves the board and it keeps working even when the network drops.",
      parts: [
        {
          label: "THE BOARD",
          text: "Designed from scratch around a chip cheap enough to put in every unit, with power and network over a single cable.",
        },
        {
          label: "THE SOFTWARE ON IT",
          text: "A trimmed-down system that starts in seconds and our own image-recognition code, tuned for this exact board.",
        },
        {
          label: "AROUND IT",
          text: "A web page to view results and change settings, plus a small service to collect what the boards report.",
        },
      ],
      connects: [
        "Camera",
        "Wired network",
        "USB",
        "Memory card",
        "Sensors",
        "Lights",
      ],
      uses: [
        "Spotting defects on a production line",
        "Gateways collecting data in the field",
        "Devices that listen and respond",
      ],
    },
    sensor: {
      name: "A SENSOR THAT RUNS FOR MONTHS",
      summary:
        "A pocket-sized board that measures temperature, movement or anything else and reports it over Wi-Fi or Bluetooth. It sleeps most of the time, so one battery lasts for months.",
      parts: [
        {
          label: "THE BOARD",
          text: "Small enough to fit anywhere, sips power, and leaves room for the sensors your product needs.",
        },
        {
          label: "THE SOFTWARE ON IT",
          text: "Wakes up, takes a reading, sends it, goes back to sleep — and still recovers on its own if something goes wrong.",
        },
        {
          label: "AROUND IT",
          text: "A phone or browser view of the readings, with alerts when a value goes out of range.",
        },
      ],
      connects: ["Sensors", "Wi-Fi", "Bluetooth", "USB", "Display", "Battery"],
      uses: [
        "Rooms, fridges and machines being monitored",
        "Tags and beacons that report where things are",
        "Small USB tools and dongles",
      ],
    },
  };

  const tabs: { key: ExampleKey; label: string; icon: string }[] = [
    { key: "camera", label: "CAMERA NODE", icon: "pixelarticons:camera" },
    { key: "sensor", label: "BATTERY SENSOR", icon: "pixelarticons:battery" },
  ];

  const engagement = [
    {
      name: "Fixed-Scope Project",
      tag: "48H QUOTE",
      desc: "One price agreed up front, paid by milestone, and everything — files, designs, source code — is yours on delivery.",
    },
    {
      name: "Monthly Retainer",
      tag: "FLEX HOURS",
      desc: "Reserved engineering time for changes, field support and urgent fixes on a product already in the wild.",
    },
    {
      name: "Audit / Rescue",
      tag: "2-5 DAYS",
      desc: "A second pair of eyes on an existing board, firmware or codebase: what is wrong, what it would cost to fix.",
    },
  ];

  let selectedExample = $state<ExampleKey>("camera");
</script>

<section id="inspector" class="space-y-8">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
    <div class="md:col-span-5">
      <div class="text-xs text-[#88A888] uppercase tracking-widest mb-2">
        WHAT WE BUILD
      </div>
      <h2 class="text-2xl md:text-3xl uppercase">TWO EXAMPLES OF OUR WORK</h2>
    </div>
    <div class="md:col-span-7 flex flex-col md:items-end gap-3">
      <span
        class="text-xs uppercase tracking-widest text-[#FFFFFF] md:text-right"
      >
        Representative examples - we build on any board, chip or server
      </span>
      <div class="flex flex-wrap gap-3">
        {#each tabs as tab}
          <button
            onclick={() => (selectedExample = tab.key)}
            class="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest cursor-pointer no-underline leading-none {selectedExample ===
            tab.key
              ? 'bg-[#88A888] text-[#000000]'
              : 'bg-surface text-[#FFFFFF] hover:bg-surface-hover'}"
          >
            <Icon icon={tab.icon} class="w-4 h-4 shrink-0" />
            <span class="leading-none">{tab.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {#key selectedExample}
      {@const example = examples[selectedExample]}
      <div class="lg:col-span-7 bg-surface p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h3
            class="text-xl md:text-2xl text-[#FFFFFF] uppercase tracking-wide"
          >
            {example.name}
          </h3>
          <p class="text-sm text-[#FFFFFF]/80 leading-relaxed mt-3">
            {example.summary}
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border text-xs"
        >
          {#each example.parts as part}
            <div class="space-y-1.5">
              <span
                class="text-[11px] text-[#88A888] block uppercase tracking-wider"
                >{part.label}</span
              >
              <span class="text-[#FFFFFF]/75 leading-relaxed block"
                >{part.text}</span
              >
            </div>
          {/each}
        </div>

        <div class="mt-auto pt-6 border-t border-border space-y-5">
          <div>
            <div class="flex justify-between items-center gap-3 mb-2">
              <span class="text-[10px] text-[#88A888] uppercase tracking-widest"
                >CONNECTIVITY</span
              >
              <span
                class="text-[10px] text-[#FFFFFF]/45 uppercase tracking-widest"
                >CUSTOMIZED PER PRODUCT</span
              >
            </div>
            <div
              class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#FFFFFF]/80"
            >
              {#each example.connects as item}
                <span class="inline-flex items-center gap-1.5">
                  <span class="text-[#88A888]">·</span>
                  {item}
                </span>
              {/each}
            </div>
          </div>

          <div class="space-y-2">
            <span
              class="text-[10px] text-[#88A888] uppercase tracking-widest block"
              >TYPICAL USE CASES</span
            >
            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#FFFFFF]/75"
            >
              {#each example.uses as use}
                <div class="leading-relaxed">
                  <span class="text-[#88A888] mr-1.5">+</span>{use}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/key}

    <div
      class="lg:col-span-5 bg-surface p-6 md:p-8 flex flex-col justify-between"
    >
      <div>
        <div
          class="flex justify-between items-center mb-6 pb-4 border-b border-border"
        >
          <span class="text-xs text-[#88A888] uppercase tracking-widest"
            >HOW WE WORK TOGETHER</span
          >
          <span class="text-[10px] text-[#FFFFFF]/60 uppercase tracking-wider"
            >NDA BY DEFAULT</span
          >
        </div>

        <div class="divide-y divide-border">
          {#each engagement as eng}
            <div class="py-4 first:pt-0 last:pb-0 space-y-1.5">
              <div class="flex justify-between items-baseline gap-3">
                <span class="text-sm text-[#FFFFFF] uppercase">{eng.name}</span>
                <span class="text-xs text-[#88A888] uppercase tracking-wider"
                  >{eng.tag}</span
                >
              </div>
              <p class="text-xs text-[#FFFFFF]/65 leading-relaxed">
                {eng.desc}
              </p>
            </div>
          {/each}
        </div>
      </div>

      <div
        class="mt-6 pt-4 border-t border-border text-xs text-[#88A888] flex justify-between gap-3"
      >
        <span>REPLY WITHIN: 24H</span>
        <span>REMOTE · WORLDWIDE</span>
      </div>
    </div>
  </div>
</section>
