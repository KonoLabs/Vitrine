<script lang="ts">
  const pipeline = [
    {
      title: "Discovery & Quote",
      duration: "48H",
      summary:
        "Send a sketch, a spec or an existing project. We work out what it takes, point out the risks early, and come back with a fixed price.",
      deliverables: [
        "Scope and risk review",
        "Estimated part cost per unit",
        "Fixed-price quote",
      ],
    },
    {
      title: "Design & Layout",
      duration: "5-10 DAYS",
      summary:
        "We draw the board and lay out the tracks, pick the layer stack so fast signals stay clean, then check everything is buildable before it goes to the factory.",
      deliverables: [
        "Editable board design files",
        "Manufacturing files for the factory",
        "Complete parts list",
      ],
    },
    {
      title: "Bench Testing & Firmware",
      duration: "1-3 WEEKS",
      summary:
        "The first boards are powered up and checked circuit by circuit, then we write the firmware, make sure it starts reliably, and hand over tested releases.",
      deliverables: [
        "Test report from the bench",
        "Firmware source code",
        "Ready-to-flash releases",
      ],
    },
    {
      title: "Production & Support",
      duration: "ONGOING",
      summary:
        "We keep an eye on assembly, check the first units, and stay available afterwards for revisions, cost cuts and anything that shows up in the field.",
      deliverables: [
        "Assembly and test documentation",
        "Versioned releases",
        "Post-launch support",
      ],
    },
  ];

  const metrics = [
    {
      value: "48H",
      label: "Quote Turnaround",
      note: "FIXED PRICE · NO SURPRISES",
    },
    {
      value: "10 DAYS",
      label: "Typical Prototype",
      note: "FROM IDEA TO WORKING SAMPLE",
    },
    {
      value: "< 24H",
      label: "Engineer Response",
      note: "YOU TALK TO THE ENGINEERS",
    },
    {
      value: "100%",
      label: "IP & Source Ownership",
      note: "DESIGNS · FILES · SOURCE CODE",
    },
  ];

  let activeStage = $state(0);
</script>

<section id="delivery" class="space-y-8">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="text-xs text-[#86A881] uppercase tracking-widest">
        HOW IT GOES
      </div>
      <h2 class="text-xl md:text-2xl uppercase mt-1">
        FROM IDEA TO PRODUCTION: 4 STAGES
      </h2>
    </div>
    <div
      class="text-xs uppercase tracking-widest text-[#FFFFFF] md:text-right"
    >
      FIXED-PRICE QUOTES · PAY BY MILESTONE · YOU OWN IT ALL
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each pipeline as stage, i}
      <button
        onclick={() => (activeStage = i)}
        class="text-left p-5 cursor-pointer no-underline transition-colors {activeStage ===
        i
          ? 'bg-[#86A881] text-[#000000]'
          : 'bg-[var(--color-surface)] text-[#FFFFFF] hover:bg-[var(--color-surface-hover)]'}"
      >
        <div
          class="text-[10px] uppercase tracking-widest {activeStage === i
            ? 'text-[#000000]/70'
            : 'text-[#86A881]'}"
        >
          {stage.duration}
        </div>
        <div class="text-sm uppercase mt-1">{stage.title}</div>
      </button>
    {/each}
  </div>

  {#key activeStage}
    {@const stage = pipeline[activeStage]}
    <div class="bg-[var(--color-surface)] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div class="md:col-span-5 space-y-4">
        <div>
          <h3 class="text-lg md:text-xl uppercase">{stage.title}</h3>
        </div>
        <p class="text-xs md:text-sm text-[#FFFFFF]/75 leading-relaxed">
          {stage.summary}
        </p>
        <div class="pt-4 border-t border-[var(--color-border)] text-xs text-[#86A881]">
          ESTIMATED DURATION: {stage.duration}
        </div>
      </div>

      <div class="md:col-span-7 space-y-3">
        <div class="text-xs text-[#86A881] uppercase tracking-widest mb-3">
          WHAT YOU RECEIVE
        </div>
        <div class="divide-y divide-[var(--color-border)]">
          {#each stage.deliverables as d}
            <div
              class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs text-[#FFFFFF]"
            >
              <span>{d}</span>
              <span class="text-[#86A881] text-sm">✓</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/key}

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each metrics as m}
      <div class="bg-[var(--color-surface)] p-6 space-y-2">
        <div class="text-2xl md:text-3xl text-[#86A881]">{m.value}</div>
        <div class="text-[11px] uppercase tracking-widest text-[#FFFFFF]">
          {m.label}
        </div>
        <div class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
          {m.note}
        </div>
      </div>
    {/each}
  </div>
</section>
