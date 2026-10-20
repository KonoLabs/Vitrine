<script lang="ts">
  // Delivery Pipeline Stages (business data)
  const pipeline = [
    {
      code: "01",
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
      code: "02",
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
      code: "03",
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
      code: "04",
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

  // Business Metrics (business data)
  const metrics = [
    {
      value: "48H",
      label: "Quote Turnaround",
      note: "FIXED PRICE // NO SURPRISES",
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
      note: "DESIGNS // FILES // SOURCE CODE",
    },
  ];

  let activeStage = $state(0);
</script>

<!-- SECTION 02: DELIVERY PIPELINE & BUSINESS METRICS -->
<section id="delivery" class="bg-[#353535] p-6 md:p-10 space-y-6">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="text-xs text-[#86A881] uppercase tracking-widest">
        02 // HOW IT GOES
      </div>
      <h2 class="text-xl md:text-2xl uppercase mt-1">
        FROM IDEA TO PRODUCTION // 4 STAGES
      </h2>
    </div>
    <div
      class="text-[11px] uppercase tracking-widest text-[#FFFFFF]/60 md:text-right"
    >
      FIXED-PRICE QUOTES // PAY BY MILESTONE // YOU OWN IT ALL
    </div>
  </div>

  <!-- Stage Selector -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {#each pipeline as stage, i}
      <button
        onclick={() => (activeStage = i)}
        class="text-left p-4 cursor-pointer {activeStage === i
          ? 'bg-[#86A881] text-[#000000]'
          : 'bg-[#404040] text-[#FFFFFF] hover:bg-[#000000]'}"
      >
        <div
          class="text-[10px] uppercase tracking-widest {activeStage === i
            ? 'text-[#000000]/70'
            : 'text-[#86A881]'}"
        >
          STAGE {stage.code} // {stage.duration}
        </div>
        <div class="text-sm uppercase mt-1">{stage.title}</div>
      </button>
    {/each}
  </div>

  <!-- Active Stage Detail -->
  {#key activeStage}
    {@const stage = pipeline[activeStage]}
    <div class="bg-[#000000] p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 space-y-3">
        <div>
          <div class="text-[10px] text-[#86A881] uppercase tracking-widest">
            STEP {stage.code}
          </div>
          <h3 class="text-lg uppercase mt-1">{stage.title}</h3>
        </div>
        <p class="text-xs text-[#FFFFFF]/75 leading-relaxed">{stage.summary}</p>
        <div
          class="bg-[#353535] p-3 text-[11px] text-[#86A881] flex justify-between gap-3"
        >
          <span>ETA: {stage.duration}</span>
          <span>[MILESTONE {stage.code}/04]</span>
        </div>
      </div>

      <div class="md:col-span-7 space-y-2">
        <div class="text-[10px] text-[#86A881] uppercase tracking-widest mb-1">
          WHAT YOU GET
        </div>
        {#each stage.deliverables as d, j}
          <div
            class="flex items-center justify-between gap-4 bg-[#353535] px-4 py-3 text-xs"
          >
            <span class="text-[#FFFFFF]">{d}</span>
            <span class="text-[10px] text-[#86A881]"
              >OUT_{String(j + 1).padStart(2, "0")}</span
            >
          </div>
        {/each}
      </div>
    </div>
  {/key}

  <!-- Business Metrics Band -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {#each metrics as m}
      <div class="bg-[#404040] p-4 space-y-1">
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
