<script lang="ts">
  import { onMount } from "svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  const base = "https://github.com/KonoLabs/Fusible/releases/latest/download/";
  const releasesUrl = "https://github.com/KonoLabs/Fusible/releases/latest";

  type Os = "windows" | "macos" | "linux";

  const platforms: {
    os: Os;
    name: string;
    files: { label: string; asset: string }[];
    notes: string[];
  }[] = [
    {
      os: "windows",
      name: "WINDOWS",
      files: [
        {
          label: "Installer, x64 (.exe)",
          asset: "Fusible-Studio-windows-x64-setup.exe",
        },
      ],
      notes: [
        "The installer is unsigned for now, so SmartScreen may warn.",
        'Click "More info", then "Run anyway".',
        "It installs per user and needs no administrator rights.",
      ],
    },
    {
      os: "macos",
      name: "MACOS",
      files: [
        {
          label: "Disk image, universal (.dmg)",
          asset: "Fusible-Studio-macos-universal.dmg",
        },
      ],
      notes: [
        "The app is unsigned for now. Drag it to Applications.",
        'Right-click the app, choose "Open", then confirm "Open".',
        "Works on Apple Silicon and Intel.",
      ],
    },
    {
      os: "linux",
      name: "LINUX",
      files: [
        {
          label: "AppImage, x64",
          asset: "Fusible-Studio-linux-x64.AppImage",
        },
        { label: "Debian package, x64 (.deb)", asset: "Fusible-Studio-linux-x64.deb" },
      ],
      notes: [
        "AppImage: run chmod +x Fusible-Studio-linux-x64.AppImage, then launch it.",
        "Deb: run sudo apt install ./Fusible-Studio-linux-x64.deb.",
      ],
    },
  ];

  let detected = $state<Os | null>(null);

  onMount(() => {
    const ua = navigator.userAgent;
    if (/windows/i.test(ua)) detected = "windows";
    else if (/android/i.test(ua)) detected = null;
    else if (/mac|iphone|ipad/i.test(ua)) detected = "macos";
    else if (/linux|x11/i.test(ua)) detected = "linux";
  });

  const ordered = $derived(
    detected
      ? [
          ...platforms.filter((p) => p.os === detected),
          ...platforms.filter((p) => p.os !== detected),
        ]
      : platforms,
  );

  const version = $derived<string | null>(data.version);
  const notesUrl = $derived<string>(data.url ?? releasesUrl);

  const cliTargets = $derived(
    [
      { label: "Windows x64 (.zip)", slug: "windows_amd64", ext: "zip" },
      { label: "macOS Apple Silicon (.tar.gz)", slug: "darwin_arm64", ext: "tar.gz" },
      { label: "macOS Intel (.tar.gz)", slug: "darwin_amd64", ext: "tar.gz" },
      { label: "Linux x64 (.tar.gz)", slug: "linux_amd64", ext: "tar.gz" },
    ].map((t) => ({
      label: t.label,
      href: version
        ? `${base}fusible_${version}_${t.slug}.${t.ext}`
        : releasesUrl,
    })),
  );
</script>

<Seo
  title="Download Fusible Studio | Kono"
  description="Download Fusible Studio for Windows, macOS and Linux, or install the Fusible CLI. Free and open source."
  path="/fusible/download"
  keywords="Fusible download, Fusible Studio, tscircuit desktop app, Fusible CLI"
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
      <a
        href="/fusible"
        class="text-[#FFFFFF]/60 no-underline hover:text-[#88A888] transition-colors"
        >← FUSIBLE</a
      >
    </div>
  </header>

  <main
    class="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 pb-24 space-y-12 md:space-y-16"
  >
    <section class="space-y-4">
      <div class="text-xs text-[#88A888] uppercase tracking-widest">
        FUSIBLE STUDIO{version ? ` · V${version}` : ""}
      </div>
      <h1 class="text-3xl md:text-4xl uppercase">DOWNLOAD</h1>
      <p class="text-sm text-[#FFFFFF]/75 max-w-2xl leading-relaxed">
        The desktop app bundles the Fusible CLI and the studio. Pick your
        system below. Builds are unsigned for now, so each system asks for one
        extra click on first launch.
      </p>
      <a
        href={notesUrl}
        class="inline-block text-[10px] uppercase tracking-widest text-[#88A888] no-underline hover:text-[#FFFFFF] transition-colors"
        >RELEASE NOTES ↗</a
      >
    </section>

    <section class="space-y-6">
      {#each ordered as platform, i (platform.os)}
        {@const primary = detected !== null && i === 0}
        <div
          class="bg-surface p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 {primary
            ? 'border border-[#88A888]'
            : 'border border-transparent'}"
        >
          <div class="md:col-span-5 space-y-4">
            <div class="flex items-center gap-3">
              <h2 class="text-lg uppercase">{platform.name}</h2>
              {#if primary}
                <span
                  class="bg-[#88A888] text-[#000000] px-2 py-0.5 text-[10px] uppercase tracking-widest"
                  >YOUR SYSTEM</span
                >
              {/if}
            </div>
            <div class="flex flex-col gap-3">
              {#each platform.files as file}
                <a
                  href={base + file.asset}
                  class="inline-flex items-center justify-between gap-3 px-5 py-3 text-xs uppercase tracking-widest no-underline transition-colors {primary
                    ? 'bg-[#88A888] text-[#000000] hover:bg-[#FFFFFF]'
                    : 'border border-border-subtle text-[#FFFFFF] hover:border-[#88A888] hover:text-[#88A888]'}"
                >
                  <span>&gt; {file.label}</span>
                </a>
              {/each}
            </div>
          </div>
          <div class="md:col-span-7 space-y-2">
            <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
              FIRST RUN
            </div>
            <ul class="space-y-1.5 text-xs text-[#FFFFFF]/75">
              {#each platform.notes as note}
                <li class="leading-relaxed break-words">+ {note}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </section>

    <section id="cli" class="space-y-6">
      <h2 class="text-xl md:text-2xl uppercase">COMMAND LINE ONLY</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-surface p-6 space-y-3">
          <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
            FROM SOURCE
          </div>
          <div
            class="bg-[#000000] border border-border p-4 font-['Undefined',monospace] text-xs md:text-sm overflow-x-auto"
          >
            <div class="whitespace-nowrap">
              <span class="text-[#88A888]">$</span> cargo install fusible
            </div>
          </div>
        </div>
        <div class="bg-surface p-6 space-y-3">
          <div class="text-[10px] uppercase tracking-widest text-[#88A888]">
            PREBUILT BINARIES
          </div>
          <ul class="space-y-1.5 text-xs">
            {#each cliTargets as target}
              <li>
                <a
                  href={target.href}
                  class="text-[#FFFFFF]/75 no-underline hover:text-[#88A888] transition-colors"
                  >+ {target.label}</a
                >
              </li>
            {/each}
          </ul>
          {#if !version}
            <p class="text-[10px] text-[#FFFFFF]/45 leading-relaxed">
              Version lookup failed. These links open the latest release page.
            </p>
          {/if}
        </div>
      </div>
    </section>
  </main>
</div>
