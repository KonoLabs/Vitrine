<script>
  const projects = [
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
      tagline: "PORTFOLIO // THIS SITE",
      description:
        "This website: SvelteKit and Tailwind, mdsvex-powered blog, and a live hardware telemetry interface running entirely on the client.",
      stack: ["Svelte", "Tailwind", "mdsvex"],
      href: "/",
    },
  ];
</script>

<section class="max-w-[1440px] mx-auto px-6 md:px-12 py-12 space-y-8">
  <div>
    <span class="text-xs uppercase tracking-widest" style="color: var(--link)">01 // SELECTED WORK</span>
    <h1 class="text-3xl md:text-4xl uppercase mt-2">PROJECTS</h1>
    <p class="text-sm max-w-2xl mt-2" style="color: var(--fg)">
      Open source tools and software I build and maintain.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each projects as project, i}
      <a
        href={project.href}
        class="flex flex-col justify-between p-8 transition-colors hover:opacity-90"
        style="background: var(--surface); color: var(--fg)"
      >
        <div>
          <div class="flex justify-between items-center mb-6 text-xs">
            <span
              class="px-2.5 py-1 font-bold uppercase"
              style="background: var(--link); color: var(--code-bg)"
            >
              {String(i + 1).padStart(2, "0")} // {project.name}
            </span>
          </div>
          <span class="text-xs uppercase tracking-widest" style="color: var(--link)">
            {project.tagline}
          </span>
          <h2 class="text-xl uppercase mt-2 mb-4">{project.name}</h2>
          <p class="text-xs leading-relaxed">{project.description}</p>
        </div>

        <div class="mt-8 p-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest" style="background: var(--code-bg)">
          {#each project.stack as tech}
            <span style="color: var(--code-fg)">{tech}</span>
          {/each}
        </div>
      </a>
    {/each}
  </div>
</section>
