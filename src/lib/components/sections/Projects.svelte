<script>
  import Icon from '@iconify/svelte';
  const projects = [
    { name: "Brain.h", description: "A single-header C library designed to simplify machine learning by providing structures and functions for creating neural networks.", tech: ["C", "Header-only library"], githubUrl: "https://github.com/saravenpi/brain.h" },
  ];
</script>

<main>
  <h1 class="page-title">
    <Icon icon="pixelarticons:code" width="28" />
    <span>Projects</span>
  </h1>
  {#each projects as project}
    <section>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p><strong>Tech:</strong> {project.tech.join(", ")}</p>
      <p>
        {#if project.githubUrl}<a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>{/if}
        {#if project.liveUrl}{#if project.githubUrl}|{/if}<a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Site</a>{/if}
      </p>
    </section>
  {/each}
</main>

<style>
  .page-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  section { margin: 2rem 0; padding: 1rem 0; border-bottom: 1px solid #cdb8a0; }
  section:last-child { border-bottom: none; }
</style>
