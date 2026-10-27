<script>
  const projects = [
    {
      name: "fieldcam",
      tagline: "FIELD CAMERA · HARDWARE + FIRMWARE",
      description:
        "An autonomous field camera for remote sites: ESP32-S3 controller board, 4G LTE video, sub-GHz voice, LiPo power and bare-metal Rust firmware with pin bindings checked against the board.",
      stack: ["KiCad", "ESP32-S3", "Rust"],
      href: "/fieldcam",
    },
    {
      name: "knot",
      tagline: "LANGUAGE-AGNOSTIC MONOREPO MANAGER",
      description:
        "A monorepo package manager that handles symlinking, context-aware builds and TypeScript path aliases across Rust, Go, Python and TypeScript projects.",
      stack: ["Rust", "TypeScript", "CLI"],
      href: "https://github.com/saravenpi/knot",
    },
    {
      name: "dotfiles",
      tagline: "REPRODUCIBLE DEV ENVIRONMENT",
      description:
        "Fully scripted, reproducible development environment, installable from a single curl command. Shell, Neovim, window manager and tooling configured as code.",
      stack: ["Shell", "Linux", "Neovim"],
      href: "https://github.com/saravenpi/dotfiles",
    },
    {
      name: "saravenpi.com",
      tagline: "PORTFOLIO · THIS SITE",
      description:
        "This website: SvelteKit and Tailwind, mdsvex-powered blog, and a live hardware telemetry interface running entirely on the client.",
      stack: ["Svelte", "Tailwind", "mdsvex"],
      href: "/",
    },
  ];
</script>

<section class="max-w-[1440px] mx-auto px-6 md:px-12 py-12 space-y-8">
  <div>
    <span class="text-xs uppercase tracking-widest text-[#88A888]"
      >SELECTED WORK</span
    >
    <h1 class="text-3xl md:text-4xl uppercase mt-2">PROJECTS</h1>
    <p class="text-sm max-w-2xl mt-2 text-[#FFFFFF]/75">
      Open source tools and software I build and maintain.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each projects as project}
      <a
        href={project.href}
        class="flex flex-col justify-between p-8 bg-surface text-[#FFFFFF] no-underline transition-colors hover:bg-surface-hover"
      >
        <div>
          <span
            class="text-xs uppercase tracking-widest text-[#88A888] block mb-2"
          >
            {project.tagline}
          </span>
          <h2 class="text-xl uppercase mb-3">{project.name}</h2>
          <p class="text-xs text-[#FFFFFF]/75 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div
          class="mt-8 pt-4 border-t border-border flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-widest text-[#88A888]"
        >
          {#each project.stack as tech}
            <span>{tech}</span>
          {/each}
        </div>
      </a>
    {/each}
  </div>
</section>
