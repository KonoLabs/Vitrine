<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let introActive = $state(true);

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
    let startTime = performance.now();

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    resize();
    window.addEventListener("resize", resize);

    function render(time: number) {
      const elapsed = time - startTime;
      const isMobile = width < 768;
      const step = isMobile ? 5 : 4;
      const containerWidth = Math.min(width, 1440);
      const containerLeft = (width - containerWidth) / 2;

      ctx.clearRect(0, 0, width, height);

      if (introActive && elapsed < 900) {
        ctx.fillStyle = "#86A881";
        ctx.fillRect(0, 0, width, height);

        const spineCount = 24;
        const headP = time * 0.0022;

        ctx.fillStyle = "#000000";

        for (let i = 0; i < spineCount - 1; i++) {
          const s0 = i / (spineCount - 1);
          const s1 = (i + 1) / (spineCount - 1);

          const p0 = headP - s0 * 0.75;
          const p1 = headP - s1 * 0.75;

          const x0 =
            width * 0.5 +
            Math.sin(p0) * (width * 0.24) +
            Math.cos(p0 * 2.2) * (width * 0.08);
          const y0 =
            height * 0.48 +
            Math.cos(p0 * 1.3) * (height * 0.2) +
            Math.sin(p0 * 0.7) * (height * 0.08);

          const x1 =
            width * 0.5 +
            Math.sin(p1) * (width * 0.24) +
            Math.cos(p1 * 2.2) * (width * 0.08);
          const y1 =
            height * 0.48 +
            Math.cos(p1 * 1.3) * (height * 0.2) +
            Math.sin(p1 * 0.7) * (height * 0.08);

          const r0 = (isMobile ? 36 : 64) * (0.35 + 0.65 * Math.sin(Math.PI * (1 - s0 * 0.7)));
          const r1 = (isMobile ? 36 : 64) * (0.35 + 0.65 * Math.sin(Math.PI * (1 - s1 * 0.7)));

          const minY = Math.floor(Math.max(0, Math.min(y0, y1) - Math.max(r0, r1)) / step) * step;
          const maxY = Math.ceil(Math.min(height, Math.max(y0, y1) + Math.max(r0, r1)) / step) * step;

          const dy = y1 - y0;
          for (let sy = minY; sy <= maxY; sy += step) {
            const t = Math.abs(dy) > 0.001 ? Math.max(0, Math.min(1, (sy - y0) / dy)) : 0.5;
            const cx = x0 + (x1 - x0) * t;
            const r = r0 + (r1 - r0) * t;
            const minX = Math.floor(Math.max(0, cx - r) / step) * step;
            const maxX = Math.ceil(Math.min(width, cx + r) / step) * step;
            const by = Math.floor(sy / step) & 3;

            for (let sx = minX; sx <= maxX; sx += step) {
              const dx = Math.abs(sx - cx);
              const norm = dx / r;
              if (norm > 1) continue;
              const intensity = 1 - norm * norm;
              const bx = Math.floor(sx / step) & 3;
              if (intensity > bayer4[by * 4 + bx]) {
                ctx.fillRect(sx, sy, step, step);
              }
            }
          }
        }
      } else if (introActive && elapsed < 1400) {
        ctx.fillStyle = "#86A881";
        ctx.fillRect(0, 0, width, height);

        const dockU = (elapsed - 900) / 500;
        const ease = dockU * dockU * (3 - 2 * dockU);
        const spineCount = 24;
        const headP = time * 0.0022;

        ctx.fillStyle = "#000000";

        for (let i = 0; i < spineCount - 1; i++) {
          const s0 = i / (spineCount - 1);
          const s1 = (i + 1) / (spineCount - 1);

          const p0 = headP - s0 * 0.75;
          const p1 = headP - s1 * 0.75;

          const wx0 =
            width * 0.5 +
            Math.sin(p0) * (width * 0.24) +
            Math.cos(p0 * 2.2) * (width * 0.08);
          const wy0 =
            height * 0.48 +
            Math.cos(p0 * 1.3) * (height * 0.2) +
            Math.sin(p0 * 0.7) * (height * 0.08);

          const wx1 =
            width * 0.5 +
            Math.sin(p1) * (width * 0.24) +
            Math.cos(p1 * 2.2) * (width * 0.08);
          const wy1 =
            height * 0.48 +
            Math.cos(p1 * 1.3) * (height * 0.2) +
            Math.sin(p1 * 0.7) * (height * 0.08);

          const wr0 = (isMobile ? 36 : 64) * (0.35 + 0.65 * Math.sin(Math.PI * (1 - s0 * 0.7)));
          const wr1 = (isMobile ? 36 : 64) * (0.35 + 0.65 * Math.sin(Math.PI * (1 - s1 * 0.7)));

          const ty0 = s0 * (height * 0.7);
          const ty1 = s1 * (height * 0.7);

          const pt0 = getSplinePoint(ty0);
          const pt1 = getSplinePoint(ty1);

          const tw0 = Math.sin(ty0 * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);
          const tw1 = Math.sin(ty1 * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);

          const tx0 = containerLeft + containerWidth * pt0.x + tw0;
          const tx1 = containerLeft + containerWidth * pt1.x + tw1;

          const tr0 = isMobile ? pt0.r * 0.55 : pt0.r;
          const tr1 = isMobile ? pt1.r * 0.55 : pt1.r;

          const x0 = wx0 + (tx0 - wx0) * ease;
          const y0 = wy0 + (ty0 - wy0) * ease;
          const r0 = wr0 + (tr0 - wr0) * ease;

          const x1 = wx1 + (tx1 - wx1) * ease;
          const y1 = wy1 + (ty1 - wy1) * ease;
          const r1 = wr1 + (tr1 - wr1) * ease;

          const minY = Math.floor(Math.max(0, Math.min(y0, y1) - Math.max(r0, r1)) / step) * step;
          const maxY = Math.ceil(Math.min(height, Math.max(y0, y1) + Math.max(r0, r1)) / step) * step;

          const dy = y1 - y0;
          for (let sy = minY; sy <= maxY; sy += step) {
            const t = Math.abs(dy) > 0.001 ? Math.max(0, Math.min(1, (sy - y0) / dy)) : 0.5;
            const cx = x0 + (x1 - x0) * t;
            const r = r0 + (r1 - r0) * t;
            const minX = Math.floor(Math.max(0, cx - r) / step) * step;
            const maxX = Math.ceil(Math.min(width, cx + r) / step) * step;
            const by = Math.floor(sy / step) & 3;

            for (let sx = minX; sx <= maxX; sx += step) {
              const dx = Math.abs(sx - cx);
              const norm = dx / r;
              if (norm > 1) continue;
              const intensity = 1 - norm * norm;
              const bx = Math.floor(sx / step) & 3;
              if (intensity > bayer4[by * 4 + bx]) {
                ctx.fillRect(sx, sy, step, step);
              }
            }
          }
        }
      } else if (introActive && elapsed < 1900) {
        const wipeProgress = (elapsed - 1400) / 500;
        const scanY = (wipeProgress * 1.4 - 0.2) * height;
        const band = 80;

        const solidTop = Math.max(0, Math.floor((scanY + band) / step) * step);
        if (solidTop < height) {
          ctx.fillStyle = "#86A881";
          ctx.fillRect(0, solidTop, width, height - solidTop);
        }

        const bandStart = Math.max(0, Math.floor((scanY - band) / step) * step);
        const bandEnd = Math.min(height, solidTop);
        ctx.fillStyle = "#86A881";
        for (let sy = bandStart; sy < bandEnd; sy += step) {
          const u = (sy - (scanY - band)) / (2 * band);
          const by = Math.floor(sy / step) & 3;
          for (let sx = 0; sx < width; sx += step) {
            const bx = Math.floor(sx / step) & 3;
            if (bayer4[by * 4 + bx] > 1 - u) {
              ctx.fillRect(sx, sy, step, step);
            }
          }
        }

        const scrollY = window.scrollY;
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
          const u = Math.max(0, Math.min(1, (sy - (scanY - band)) / (2 * band)));

          for (let sx = minX; sx < maxX; sx += step) {
            const dx = Math.abs(sx - cx);
            const norm = dx / radius;
            const density = 1 - norm * norm;
            const pulse = Math.sin(worldY * 0.015 - time * 0.004) * 0.22;
            const intensity = density + pulse;

            const bx = Math.floor(sx / step) & 3;
            const threshold = bayer4[by * 4 + bx];

            if (intensity > threshold) {
              const isGreen = threshold > 1 - u;
              ctx.fillStyle = isGreen ? "#000000" : "#86A881";
              ctx.fillRect(sx, sy, step, step);
            }
          }
        }
      } else {
        if (introActive) {
          introActive = false;
        }

        ctx.fillStyle = "#86A881";
        const scrollY = window.scrollY;

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

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape" && introActive) {
      introActive = false;
    }
  }}
  onclick={() => {
    if (introActive) {
      introActive = false;
    }
  }}
/>

<canvas
  bind:this={canvas}
  class="fixed inset-0 block {introActive ? 'z-50 pointer-events-auto' : 'z-0 pointer-events-none opacity-75'}"
  style="image-rendering: pixelated;"
></canvas>
