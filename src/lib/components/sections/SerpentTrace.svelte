<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  interface Waypoint {
    y: number;
    x: number;
    r: number;
  }

  const waypoints: Waypoint[] = [
    { y: 0, x: 0.82, r: 105 },
    { y: 400, x: 0.86, r: 115 },
    { y: 900, x: 0.72, r: 95 },
    { y: 1600, x: 0.32, r: 105 },
    { y: 2400, x: 0.78, r: 115 },
    { y: 3200, x: 0.28, r: 100 },
    { y: 4000, x: 0.72, r: 110 },
    { y: 5000, x: 0.45, r: 90 },
    { y: 7000, x: 0.5, r: 85 },
  ];

  const bayer4 = [
    0 / 16, 8 / 16, 2 / 16, 10 / 16,
    12 / 16, 4 / 16, 14 / 16, 6 / 16,
    3 / 16, 11 / 16, 1 / 16, 9 / 16,
    15 / 16, 7 / 16, 13 / 16, 5 / 16,
  ];

  function getSplinePoint(worldY: number): { x: number; r: number } {
    if (worldY <= waypoints[0].y) {
      return { x: waypoints[0].x, r: waypoints[0].r };
    }
    const last = waypoints[waypoints.length - 1];
    if (worldY >= last.y) {
      return { x: last.x, r: last.r };
    }

    for (let i = 0; i < waypoints.length - 1; i++) {
      const p0 = waypoints[i];
      const p1 = waypoints[i + 1];
      if (worldY >= p0.y && worldY <= p1.y) {
        const u = (worldY - p0.y) / (p1.y - p0.y);
        const s = u * u * (3 - 2 * u);
        return {
          x: p0.x + (p1.x - p0.x) * s,
          r: p0.r + (p1.r - p0.r) * s,
        };
      }
    }

    return { x: last.x, r: last.r };
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    resize();
    window.addEventListener("resize", resize);

    function render(time: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#86A881";

      const scrollY = window.scrollY;
      const isMobile = width < 768;
      const step = isMobile ? 5 : 4;
      const containerWidth = Math.min(width, 1440);
      const containerLeft = (width - containerWidth) / 2;

      for (let sy = 0; sy < height; sy += step) {
        const worldY = sy + scrollY;
        const pt = getSplinePoint(worldY);
        const baseCenterX = containerLeft + containerWidth * pt.x;
        const wave =
          Math.sin(worldY * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);
        const cx = baseCenterX + wave;
        const radius = isMobile ? pt.r * 0.55 : pt.r;

        const minX = Math.floor(Math.max(0, cx - radius) / step) * step;
        const maxX = Math.ceil(Math.min(width, cx + radius) / step) * step;

        const by = Math.floor(sy / step) & 3;

        for (let sx = minX; sx < maxX; sx += step) {
          const dx = Math.abs(sx - cx);
          const norm = dx / radius;
          const density = 1 - norm * norm;
          const pulse = Math.sin(worldY * 0.015 - time * 0.004) * 0.22;
          const intensity = density + pulse;

          const bx = Math.floor(sx / step) & 3;
          const threshold = bayer4[by * 4 + bx];

          if (intensity > threshold) {
            ctx.fillRect(sx, sy, step, step);
          }
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none z-0 block opacity-75"
  style="image-rendering: pixelated;"
></canvas>
