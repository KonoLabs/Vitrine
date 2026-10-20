<script lang="ts">
  const pillars = [
    {
      code: "CONTRACT",
      title: "ONE FILE",
      text: "A single fusible.yml ties the circuit, the chip and the firmware together, so the three can never drift apart.",
    },
    {
      code: "CHECK",
      title: "BEFORE THE BENCH",
      text: "Electrical and physical rules run on the circuit file itself, before a line of firmware exists.",
    },
    {
      code: "FUSE BLOWS",
      title: "FAIL-CLOSED",
      text: "A failing rule exits with an error and no firmware is generated. A broken board never reaches production.",
    },
  ];

  const commands = [
    { prompt: "$", line: "cargo install fusible", note: "" },
    { prompt: "$", line: "fusible init --name sensor-node", note: "" },
    { prompt: "$", line: "fusible check" },
  ];
</script>

<section id="fusible" class="space-y-8">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="text-xs text-[#86A881] uppercase tracking-widest">
        OPEN SOURCE
      </div>
      <h2 class="text-xl md:text-2xl uppercase mt-1">
        FUSIBLE: THE ELECTRONIC LINTER
      </h2>
    </div>
    <div
      class="text-[11px] uppercase tracking-widest text-[#FFFFFF]/60 md:text-right"
    >
      WRITTEN IN RUST · FAIL-CLOSED BY DESIGN
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div
      class="lg:col-span-5 bg-[#1F1F1F] p-6 md:p-8 space-y-5 flex flex-col justify-between"
    >
      <div class="space-y-5">
        <p class="text-sm text-[#FFFFFF]/80 leading-relaxed">
          Hardware and firmware usually live in two separate worlds, and
          mistakes only show up on the bench. Fusible reads the circuit file
          your design tools produce, checks it against the rules a board must
          respect, and refuses to generate firmware for a board that fails them.
        </p>
        <div class="space-y-2 text-xs text-[#86A881]">
          <div>+ Reads the circuit JSON produced by tscircuit</div>
          <div>+ Checks the electrical and physical rules of the board</div>
          <div>+ One fusible.yml for circuit, chip and firmware</div>
          <div>+ Documented exit codes your build can act on</div>
        </div>
      </div>
      <div
        class="border-t border-[#2E2E2E] pt-4 text-[10px] uppercase tracking-widest text-[#FFFFFF]/45"
      >
        OPEN SOURCE · GITHUB.COM/KONOLABS/FUSIBLE
      </div>
    </div>

    <div class="lg:col-span-7 bg-[#1F1F1F] p-6 md:p-8 space-y-6">
      <div class="flex justify-between items-center gap-3">
        <span class="text-xs text-[#86A881] uppercase tracking-widest"
          >QUICK START</span
        >
        <span class="text-[10px] text-[#FFFFFF]/45 uppercase tracking-widest"
          >FAIL-CLOSED BY DESIGN</span
        >
      </div>
      <div
        class="bg-[#000000] p-4 md:p-5 font-['Undefined',monospace] text-xs md:text-sm leading-loose border border-[#2E2E2E]"
      >
        {#each commands as cmd}
          <div class="flex flex-wrap gap-x-2">
            <span class="text-[#86A881]">{cmd.prompt}</span>
            <span class="text-[#FFFFFF]">{cmd.line}</span>
            {#if cmd.note}
              <span class="text-[#FFFFFF]/45">{cmd.note}</span>
            {/if}
          </div>
        {/each}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {#each pillars as pillar}
          <div class="space-y-1.5">
            <span
              class="text-[10px] uppercase tracking-widest text-[#86A881] block"
              >{pillar.code}</span
            >
            <div class="text-xs uppercase text-[#FFFFFF]">
              {pillar.title}
            </div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {pillar.text}
            </p>
          </div>
        {/each}
      </div>
      <div>
        <a
          href="https://github.com/KonoLabs/Fusible#readme"
          class="inline-flex items-center gap-3 bg-[#86A881] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF]"
        >
          &gt; READ THE DOCS ON GITHUB
        </a>
      </div>
    </div>
  </div>
</section>
