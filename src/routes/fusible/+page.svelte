<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";

  const rules = [
    {
      code: "unconnected_net",
      text: "A net with a single pin goes nowhere. Fusible flags every dangling pad.",
    },
    {
      code: "ghost_net",
      text: "A trace or port that points at a net nothing declares is reported, never assumed valid.",
    },
    {
      code: "shorted_nets",
      text: "Two named nets that touch the same copper are one net by accident.",
    },
    {
      code: "malformed_element",
      text: "Elements missing an id, a position or a reference fail before they can corrupt a check.",
    },
    {
      code: "trace_clearance",
      text: "Copper closer than the fab allows is caught on the layout, not on the bench.",
    },
    {
      code: "pin_mux",
      text: "A pin wired to a function the chip cannot route is rejected against the silicon's mux table.",
    },
  ];

  const shots = [
    {
      label: "PCB LAYOUT",
      src: "/fusible/demo4.png",
      alt: "Fusible Studio PCB layout",
      desc: "Gerber and drill visualizer, drawn natively.",
    },
    {
      label: "DIAGNOSTICS",
      src: "/fusible/demo2.png",
      alt: "Fusible Studio diagnostics",
      desc: "Rule violations and pin-mux conflicts as you edit.",
    },
    {
      label: "SCHEMATIC",
      src: "/fusible/demo3.png",
      alt: "Fusible Studio schematic",
      desc: "Vector schematic with net inspection.",
    },
    {
      label: "3D VIEW",
      src: "/fusible/demo1.png",
      alt: "Fusible Studio 3D view",
      desc: "Interactive board with live component placement.",
    },
  ];

  const manifest = `name: rover

boards:
  main:   { entry: boards/main/index.tsx, mcu: esp32-s3 }
  sensor: { entry: boards/sensor/index.tsx, mcu: rp2040 }

firmware:
  app:
    board: main
    path: firmware
    framework: embassy
    pins_rs: firmware/src/pins.rs

bodies:
  case:
    generate: enclosure
    board: main`;

  const manifestPoints = [
    {
      code: "BOARDS",
      text: "Named circuits with their chip, so every check knows the silicon.",
    },
    {
      code: "FIRMWARE",
      text: "Typed pin bindings are generated from the checked board, never hand-copied.",
    },
    {
      code: "BODIES",
      text: "Authored or generated enclosures, built only once the board passes.",
    },
  ];

  const presets = [
    {
      code: "FAB",
      files: "gerbers.zip · circuit.json",
      text: "What the board house needs.",
    },
    {
      code: "CAD",
      files: "kicad.zip · board.step",
      text: "What the mechanical side needs.",
    },
    {
      code: "DOCS",
      files: "schematic.svg · pcb.svg · schematic.pdf",
      text: "What a reviewer needs.",
    },
  ];

  const commands = [
    "cargo install fusible",
    "fusible init --name sensor-node",
    "fusible check",
    "fusible export --preset all",
  ];
</script>

<Seo
  title="Fusible — the fuse for your hardware | Kono"
  description="Fusible is an open-source electronic linter and tscircuit project manager. A failing rule blows the fuse and blocks exports and firmware codegen. Download Fusible Studio or the CLI."
  path="/fusible"
  keywords="Fusible, tscircuit, electronic linter, PCB design rule check, Circuit JSON, Embassy, firmware codegen, Gerber export"
/>

<div class="relative min-h-screen bg-[#000000] text-[#FFFFFF]">
  <header class="border-b border-border">
    <div
      class="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4 text-[11px] uppercase tracking-widest"
    >
      <a href="/" class="no-underline flex items-center gap-2">
        <img
          src="/long-logo-green-bg.png"
          alt="KONO"
          class="h-6 w-auto block"
        />
      </a>
      <div class="flex items-center gap-6">
        <a
          href="/fusible/download"
          class="text-[#86A881] no-underline hover:text-[#FFFFFF] transition-colors"
          >DOWNLOAD</a
        >
        <a
          href="/"
          class="text-[#FFFFFF]/60 no-underline hover:text-[#86A881] transition-colors"
          >← HOME</a
        >
      </div>
    </div>
  </header>

  <main
    class="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 pb-24 space-y-14 md:space-y-20"
  >
    <section class="space-y-6">
      <div class="text-xs text-[#86A881] uppercase tracking-widest">
        OPEN SOURCE · WRITTEN IN RUST
      </div>
      <h1 class="text-3xl md:text-5xl uppercase leading-tight max-w-3xl">
        THE FUSE FOR YOUR HARDWARE
      </h1>
      <p class="text-sm text-[#FFFFFF]/75 max-w-2xl leading-relaxed">
        Fusible reads the circuit your tscircuit design produces and checks it
        against the rules a board must respect. When a rule fails, the fuse
        blows: exports stop and no firmware is generated. A broken board never
        leaves your machine.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href="/fusible/download"
          class="inline-flex items-center justify-center gap-3 bg-[#86A881] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF] transition-colors"
        >
          &gt; DOWNLOAD
        </a>
        <a
          href="#cli"
          class="inline-flex items-center justify-center gap-3 border border-border-subtle text-[#FFFFFF] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:border-[#86A881] hover:text-[#86A881] transition-colors"
        >
          INSTALL THE CLI
        </a>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <h2 class="text-xl md:text-2xl uppercase">WHAT THE FUSE CHECKS</h2>
        <span class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
          EXIT 1 WHEN ANY RULE FAILS
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each rules as rule}
          <div class="bg-surface p-6 space-y-2">
            <div class="text-xs text-[#86A881] break-words">{rule.code}</div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {rule.text}
            </p>
          </div>
        {/each}
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <h2 class="text-xl md:text-2xl uppercase">FUSIBLE STUDIO</h2>
        <span class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
          DESKTOP APP · WINDOWS · MACOS · LINUX
        </span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {#each shots as shot}
          <figure class="bg-surface p-4 md:p-5 space-y-3">
            <div class="bg-[#000000] border border-border overflow-hidden">
              <img
                src={shot.src}
                alt={shot.alt}
                class="w-full h-auto block"
                loading="lazy"
              />
            </div>
            <figcaption class="space-y-1">
              <div class="text-[10px] uppercase tracking-widest text-[#86A881]">
                {shot.label}
              </div>
              <div class="text-[11px] text-[#FFFFFF]/65">{shot.desc}</div>
            </figcaption>
          </figure>
        {/each}
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 space-y-5">
        <h2 class="text-xl md:text-2xl uppercase">ONE MANIFEST</h2>
        <p class="text-sm text-[#FFFFFF]/75 leading-relaxed">
          A single fusible.yml ties boards, firmware and bodies together, so
          the circuit, the chip and the code can never drift apart.
        </p>
        <div class="space-y-4">
          {#each manifestPoints as point}
            <div class="border-t border-border pt-3 space-y-1">
              <div class="text-[10px] uppercase tracking-widest text-[#86A881]">
                {point.code}
              </div>
              <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
                {point.text}
              </p>
            </div>
          {/each}
        </div>
      </div>
      <div class="lg:col-span-7 min-w-0">
        <div
          class="bg-surface border border-border p-4 md:p-5 h-full overflow-x-auto"
        >
          <div
            class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45 pb-3"
          >
            FUSIBLE.YML
          </div>
          <pre
            class="font-['Undefined',monospace] text-xs leading-relaxed text-[#FFFFFF]">{manifest}</pre>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <h2 class="text-xl md:text-2xl uppercase">FUSE-GATED EXPORTS</h2>
        <span class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
          FUSIBLE EXPORT --PRESET ALL
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each presets as preset}
          <div class="border-t border-border pt-4 space-y-2">
            <div class="text-[10px] uppercase tracking-widest text-[#86A881]">
              {preset.code}
            </div>
            <div class="text-xs text-[#FFFFFF] break-words">{preset.files}</div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {preset.text}
            </p>
          </div>
        {/each}
      </div>
    </section>

    <section id="cli" class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <h2 class="text-xl md:text-2xl uppercase">CLI QUICKSTART</h2>
        <a
          href="/fusible/download#cli"
          class="text-[10px] uppercase tracking-widest text-[#86A881] no-underline hover:text-[#FFFFFF] transition-colors"
          >PREBUILT BINARIES →</a
        >
      </div>
      <div
        class="bg-surface border border-border p-4 md:p-5 font-['Undefined',monospace] text-xs md:text-sm leading-loose overflow-x-auto"
      >
        {#each commands as line}
          <div class="flex gap-x-2 whitespace-nowrap">
            <span class="text-[#86A881]">$</span>
            <span class="text-[#FFFFFF]">{line}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="flex flex-col sm:flex-row gap-3">
      <a
        href="https://github.com/KonoLabs/Fusible"
        class="inline-flex items-center justify-center gap-3 bg-[#86A881] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF] transition-colors"
      >
        &gt; GITHUB.COM/KONOLABS/FUSIBLE
      </a>
      <a
        href="/fieldcam"
        class="inline-flex items-center justify-center gap-3 border border-border-subtle text-[#FFFFFF] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:border-[#86A881] hover:text-[#86A881] transition-colors"
      >
        SEE IT ON FIELDCAM
      </a>
    </section>
  </main>
</div>
