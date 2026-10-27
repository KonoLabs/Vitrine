<script lang="ts">
  import { page } from "$app/state";
  import Seo from "$lib/components/Seo.svelte";

  const boardRules = [
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

  const productRules = [
    {
      code: "harness_mismatch",
      text: "A cable between two boards must land on pins that exist and carry the nets you declared.",
    },
    {
      code: "body_interference",
      text: "A case that overlaps the board, a component or another body is caught before anything is printed or cut.",
    },
    {
      code: "hole_misaligned",
      text: "Every mounting hole needs a boss in the body, and no material may sit in its bore.",
    },
    {
      code: "connector_blocked",
      text: "A wall in front of a connector at the board edge blows the fuse, not your first prototype.",
    },
  ];

  const scope = [
    {
      code: "MANY BOARDS, ONE PROJECT",
      text: "Name every board once. Check, build and export them together or one at a time, and cable them with links the fuse verifies.",
    },
    {
      code: "BODIES AND ASSEMBLY",
      text: "Generate an enclosure that fits the board, or bring your own STEP. Place boards and bodies in one model and check how they meet.",
    },
    {
      code: "FIRMWARE",
      text: "Typed pin bindings come from the checked board, so the code and the copper cannot drift apart.",
    },
    {
      code: "PARTS AND COSTS",
      text: "A bill of materials from the placed components and the printed bodies, with prices, picks and manual parts in bom.yml.",
    },
    {
      code: "KICAD, BOTH WAYS",
      text: "Move a part in KiCad and the position is written back to your TSX. Part and net changes are reported, never silently applied.",
    },
    {
      code: "MADE FOR TEAMS",
      text: "A Sync panel saves and shares work in plain words, with no git vocabulary. Builds are cached, and Studio updates itself.",
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

links:
  cable:
    from: main.J2
    to: sensor.J1
    wires:
      - { a: 1, b: 1, net: GND }

firmware:
  app:
    board: main
    path: firmware
    framework: embassy
    pins_rs: firmware/src/pins.rs

bodies:
  case:
    generate: enclosure
    board: main

assembly:
  parts:
    main:   { at: [0, 0, 0] }
    sensor: { at: [0, 0, 12] }
    case:   {}`;

  type Token = { text: string; tone: string };

  const tones: Record<string, string> = {
    key: "text-[#88A888]",
    path: "text-[#D9B26F]",
    value: "text-[#8FB8D8]",
    punct: "text-[#FFFFFF]/40",
    space: "",
  };

  function tokenize(line: string): Token[] {
    const parts = line.match(/\s+|[{}[\],:]|[^\s{}[\],:]+/g) ?? [];
    return parts.map((text, index) => {
      if (/^\s+$/.test(text)) return { text, tone: "space" };
      if (/^[{}[\],:]$/.test(text)) return { text, tone: "punct" };
      const next = parts.slice(index + 1).find((part) => !/^\s+$/.test(part));
      if (next === ":") return { text, tone: "key" };
      return { text, tone: /[/.]/.test(text) ? "path" : "value" };
    });
  }

  const manifestLines = manifest.split("\n").map(tokenize);

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
      code: "LINKS",
      text: "Cables between boards, verified pin by pin and net by net.",
    },
    {
      code: "BODIES",
      text: "Authored or generated enclosures, built only once the board passes.",
    },
    {
      code: "ASSEMBLY",
      text: "Boards and bodies placed in one model, checked for collisions, blocked connectors and missing bosses.",
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
    {
      code: "ASSEMBLY",
      files: "assembly.glb · assembly.step",
      text: "The whole product in one model: boards and bodies, fitted.",
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
  title="Fusible — the fuse for your whole hardware product | Kono"
  description="Fusible is an open-source tool that checks a whole hardware product: boards, cables between them, firmware and enclosure. A failing rule blows the fuse and blocks exports and codegen. Download Fusible Studio or the CLI."
  path="/fusible"
  jsonLd={{
    "@type": "SoftwareApplication",
    name: "Fusible",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description:
      "Open-source tool that checks a whole hardware product: boards, cables, firmware and enclosure. A failing rule blows the fuse and blocks exports and codegen.",
    url: `${page.url.origin}/fusible`,
    downloadUrl: `${page.url.origin}/fusible/download`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Kono" },
  }}
  keywords="Fusible, tscircuit, electronic linter, PCB design rule check, enclosure generator, hardware assembly check, bill of materials, KiCad sync, firmware codegen, Gerber export"
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
          class="text-[#88A888] no-underline hover:text-[#FFFFFF] transition-colors"
          >DOWNLOAD</a
        >
        <a
          href="/"
          class="text-[#FFFFFF]/60 no-underline hover:text-[#88A888] transition-colors"
          >← HOME</a
        >
      </div>
    </div>
  </header>

  <main
    class="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 pb-24 space-y-14 md:space-y-20"
  >
    <section class="space-y-6">
      <div class="text-xs text-[#88A888] uppercase tracking-widest">
        OPEN SOURCE · WRITTEN IN RUST
      </div>
      <h1 class="text-3xl md:text-5xl uppercase leading-tight max-w-3xl">
        THE FUSE FOR YOUR HARDWARE
      </h1>
      <p class="text-sm text-[#FFFFFF]/75 max-w-2xl leading-relaxed">
        Fusible started as a linter for tscircuit boards. It now follows the
        whole product: several boards, the cables between them, the firmware
        and the enclosure around them. When a rule fails, the fuse blows:
        exports stop and nothing is generated. A broken design never leaves
        your machine.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href="/fusible/download"
          class="inline-flex items-center justify-center gap-3 bg-[#88A888] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF] transition-colors"
        >
          &gt; DOWNLOAD
        </a>
        <a
          href="#cli"
          class="inline-flex items-center justify-center gap-3 border border-border-subtle text-[#FFFFFF] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:border-[#88A888] hover:text-[#88A888] transition-colors"
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
      <div class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
        ON EACH BOARD
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each boardRules as rule}
          <div class="bg-surface p-6 space-y-2">
            <div class="text-xs text-[#88A888] break-words">{rule.code}</div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {rule.text}
            </p>
          </div>
        {/each}
      </div>
      <div class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45 pt-2">
        ACROSS BOARDS AND BODIES
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each productRules as rule}
          <div class="bg-surface p-6 space-y-2">
            <div class="text-xs text-[#88A888] break-words">{rule.code}</div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {rule.text}
            </p>
          </div>
        {/each}
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <h2 class="text-xl md:text-2xl uppercase">
          FROM ONE BOARD TO THE WHOLE PRODUCT
        </h2>
        <span class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45">
          ONE PROJECT, ONE FUSE
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each scope as item}
          <div class="border-t border-border pt-4 space-y-2">
            <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
              {item.code}
            </div>
            <p class="text-[11px] text-[#FFFFFF]/65 leading-relaxed">
              {item.text}
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
              <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
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
          A single fusible.yml ties boards, cables, firmware, bodies and the
          assembly together, so the circuit, the chip, the code and the case can
          never drift apart.
        </p>
        <div class="space-y-4">
          {#each manifestPoints as point}
            <div class="border-t border-border pt-3 space-y-1">
              <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
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
            class="font-['Undefined',monospace] text-xs leading-relaxed text-[#FFFFFF]"><code
              class="font-[inherit]"
              >{#each manifestLines as tokens, row}{#each tokens as token}<span
                    class={tones[token.tone]}>{token.text}</span
                  >{/each}{#if row < manifestLines.length - 1}{"\n"}{/if}{/each}</code
            ></pre>
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each presets as preset}
          <div class="border-t border-border pt-4 space-y-2">
            <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
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
          class="text-[10px] uppercase tracking-widest text-[#88A888] no-underline hover:text-[#FFFFFF] transition-colors"
          >PREBUILT BINARIES →</a
        >
      </div>
      <div
        class="bg-surface border border-border p-4 md:p-5 font-['Undefined',monospace] text-xs md:text-sm leading-loose overflow-x-auto"
      >
        {#each commands as line}
          <div class="flex gap-x-2 whitespace-nowrap">
            <span class="text-[#88A888]">$</span>
            <span class="text-[#FFFFFF]">{line}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="flex flex-col sm:flex-row gap-3">
      <a
        href="https://github.com/KonoLabs/Fusible"
        class="inline-flex items-center justify-center gap-3 bg-[#88A888] text-[#000000] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:bg-[#FFFFFF] transition-colors"
      >
        &gt; GITHUB.COM/KONOLABS/FUSIBLE
      </a>
      <a
        href="/fieldcam"
        class="inline-flex items-center justify-center gap-3 border border-border-subtle text-[#FFFFFF] px-5 py-3 text-xs uppercase tracking-widest no-underline hover:border-[#88A888] hover:text-[#88A888] transition-colors"
      >
        SEE IT ON FIELDCAM
      </a>
    </section>
  </main>
</div>
