<script lang="ts">
  const pillars = [
    {
      code: "CONTRACT",
      title: "ONE FILE",
      text: "A single fusible.yml ties boards, cables, firmware and enclosure together, so they can never drift apart.",
    },
    {
      code: "CHECK",
      title: "BEFORE THE BENCH",
      text: "Electrical and physical rules run on the design itself, from one board to the finished assembly, before anything is built.",
    },
    {
      code: "FUSE BLOWS",
      title: "FAIL-CLOSED",
      text: "A failing rule exits with an error and nothing is generated. A broken design never reaches production.",
    },
  ];

  const commands = [
    { prompt: "$", line: "cargo install fusible", note: "" },
    { prompt: "$", line: "fusible init --name sensor-node", note: "" },
    { prompt: "$", line: "fusible check" },
  ];

  const demos = [
    {
      id: "pcb",
      label: "PCB LAYOUT",
      desc: "Native RS-274X Extended Gerber and Excellon drill visualizer.",
      src: "/fusible/demo4.png",
      alt: "Fusible Studio PCB layout",
    },
    {
      id: "diagnostics",
      label: "DIAGNOSTICS",
      desc: "Real-time electrical rule violations, pin-mux validation, and warnings.",
      src: "/fusible/demo2.png",
      alt: "Fusible Studio Diagnostics",
    },
    {
      id: "schematic",
      label: "SCHEMATIC",
      desc: "Pure-Rust vector documentation and schematic inspection.",
      src: "/fusible/demo3.png",
      alt: "Fusible Studio Schematic",
    },
    {
      id: "3d",
      label: "3D VIEW",
      desc: "Interactive 3D board rendering with live component placement.",
      src: "/fusible/demo1.png",
      alt: "Fusible Studio 3D view",
    },
  ];

  let selectedDemo = $state("pcb");
  const activeDemo = $derived(
    demos.find((d) => d.id === selectedDemo) ?? demos[0],
  );
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
    <div class="text-xs uppercase tracking-widest text-[#FFFFFF] md:text-right">
      WRITTEN IN RUST · FAIL-CLOSED BY DESIGN
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div
      class="lg:col-span-5 bg-surface p-6 md:p-8 space-y-5 flex flex-col justify-between"
    >
      <div class="space-y-5">
        <p class="text-sm text-[#FFFFFF]/80 leading-relaxed">
          Boards, firmware and enclosures usually live in separate worlds, and
          mistakes only show up on the bench. Fusible reads the design your
          tools produce, checks every board, the cables between them and the
          case around them, and refuses to generate anything for a design that
          fails.
        </p>
        <div class="space-y-2 text-xs text-[#86A881]">
          <div>+ Reads the circuit JSON produced by tscircuit</div>
          <div>+ Checks the electrical and physical rules of the board</div>
          <div>+ One fusible.yml for boards, firmware and enclosure</div>
          <div>+ Checks that cases fit boards: holes, bosses, connectors</div>
          <div>+ Documented exit codes your build can act on</div>
        </div>
      </div>
      <div
        class="border-t border-border pt-4 text-[10px] uppercase tracking-widest text-[#FFFFFF]/45"
      >
        OPEN SOURCE · GITHUB.COM/KONOLABS/FUSIBLE
      </div>
    </div>

    <div class="lg:col-span-7 bg-surface p-6 md:p-8 space-y-6">
      <div class="flex justify-between items-center gap-3">
        <span class="text-xs text-[#86A881] uppercase tracking-widest"
          >QUICK START</span
        >
        <span class="text-[10px] text-[#FFFFFF]/45 uppercase tracking-widest"
          >FAIL-CLOSED BY DESIGN</span
        >
      </div>
      <div
        class="bg-[#000000] p-4 md:p-5 font-['Undefined',monospace] text-xs md:text-sm leading-loose border border-border"
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
      <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <a
          href="/fusible/download"
          class="inline-flex items-center justify-center gap-3 bg-[#86A881] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF]"
        >
          &gt; DOWNLOAD
        </a>
        <a
          href="/fusible"
          class="inline-flex items-center justify-center gap-3 border border-border-subtle text-[#FFFFFF] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:border-[#86A881] hover:text-[#86A881]"
        >
          READ MORE
        </a>
        <a
          href="https://github.com/KonoLabs/Fusible#readme"
          class="inline-flex items-center justify-center gap-3 text-[#FFFFFF]/60 px-2 py-3 text-xs uppercase tracking-widest no-underline hover:text-[#86A881]"
        >
          DOCS ON GITHUB
        </a>
      </div>
    </div>
  </div>

  <div class="bg-surface p-6 md:p-8 space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4"
    >
      <div>
        <div class="text-xs text-[#86A881] uppercase tracking-widest">
          FUSIBLE STUDIO
        </div>
        <div class="text-xs text-[#FFFFFF]/70 mt-1">
          {activeDemo.desc}
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each demos as demo}
          <button
            type="button"
            onclick={() => (selectedDemo = demo.id)}
            class="px-3 py-1.5 text-xs uppercase tracking-widest transition-colors cursor-pointer {selectedDemo ===
            demo.id
              ? 'bg-[#86A881] text-[#000000]'
              : 'text-[#FFFFFF]/60 hover:text-[#FFFFFF] bg-[#000000]'}"
          >
            {demo.label}
          </button>
        {/each}
      </div>
    </div>

    <div
      class="bg-[#000000] border border-border overflow-hidden flex items-center justify-center"
    >
      <img
        src={activeDemo.src}
        alt={activeDemo.alt}
        class="w-full h-auto block object-contain max-h-[720px]"
        loading="lazy"
      />
    </div>
  </div>
</section>
