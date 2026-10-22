<script lang="ts">
  import { onMount } from "svelte";

  let {
    introActive = $bindable(true),
    wiping = $bindable(false),
  }: { introActive?: boolean; wiping?: boolean } = $props();

  let canvas: HTMLCanvasElement;
  let progress = $state(0);
  let uiOpacity = $state(1);

  let formattedProgress = $derived(
    Math.floor(progress).toString().padStart(3, "0")
  );

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
    let gridW = 0;
    let gridH = 0;
    const step = 4;
    let startTime = performance.now();

    let offCanvas: HTMLCanvasElement;
    let offCtx: CanvasRenderingContext2D | null;
    let imgData: ImageData;
    let u32: Uint32Array;
    let densityGrid: Float32Array;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      gridW = Math.ceil(width / step);
      gridH = Math.ceil(height / step);

      offCanvas = document.createElement("canvas");
      offCanvas.width = gridW;
      offCanvas.height = gridH;
      offCtx = offCanvas.getContext("2d");
      if (offCtx) {
        imgData = offCtx.createImageData(gridW, gridH);
        u32 = new Uint32Array(imgData.data.buffer);
        densityGrid = new Float32Array(gridW * gridH);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function render(time: number) {
      if (!offCtx || !u32 || !densityGrid) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = time - startTime;

      // The raster wipe is the hand-off between the inverted intro palette and
      // the page palette, so overlays above the canvas can cross-fade with it.
      const wipePhase = introActive && elapsed >= 2900 && elapsed < 3700;
      if (wiping !== wipePhase) wiping = wipePhase;

      const isMobile = width < 768;
      const containerWidth = Math.min(width, 1440);
      const containerLeft = (width - containerWidth) / 2;

      if (introActive && elapsed < 1400) {
        const t = Math.min(1, elapsed / 1400);
        const eased = t * t * (3 - 2 * t);
        progress = eased * 50;

        const spineCount = 64;
        const discs: { x: number; y: number; r: number }[] = [];
        let prevX = 0;
        let prevY = 0;
        let prevR = 0;

        for (let i = 0; i < spineCount; i++) {
          const s = i / (spineCount - 1);
          const baseY = -60 + s * (height + 120);
          const pt = getSplinePoint(baseY);
          const targetR = isMobile ? pt.r * 0.55 : pt.r;

          const wave1 =
            Math.sin(baseY * 0.003 - time * 0.0022) *
            (isMobile ? width * 0.14 : width * 0.18);
          const wave2 =
            Math.cos(baseY * 0.006 + time * 0.0015) *
            (isMobile ? width * 0.05 : width * 0.07);
          const sway =
            Math.sin(time * 0.0016 + s * 1.2) * (isMobile ? 14 : 28);

          const sx = width * 0.52 + wave1 + wave2 + sway;
          const sy = baseY + Math.sin(baseY * 0.004 + time * 0.002) * 16;
          const sr =
            targetR * (0.85 + 0.15 * Math.sin(baseY * 0.006 - time * 0.003));

          if (i > 0) {
            discs.push({
              x: (prevX + sx) * 0.5,
              y: (prevY + sy) * 0.5,
              r: (prevR + sr) * 0.5,
            });
          }
          discs.push({ x: sx, y: sy, r: sr });
          prevX = sx;
          prevY = sy;
          prevR = sr;
        }

        densityGrid.fill(0);
        for (let d = 0; d < discs.length; d++) {
          const disc = discs[d];
          const gcx = disc.x / step;
          const gcy = disc.y / step;
          const gr = disc.r / step;
          const gr2 = gr * gr;
          const minX = Math.max(0, Math.floor(gcx - gr));
          const maxX = Math.min(gridW - 1, Math.ceil(gcx + gr));
          const minY = Math.max(0, Math.floor(gcy - gr));
          const maxY = Math.min(gridH - 1, Math.ceil(gcy + gr));

          for (let gy = minY; gy <= maxY; gy++) {
            const dy2 = (gy - gcy) * (gy - gcy);
            const row = gy * gridW;
            for (let gx = minX; gx <= maxX; gx++) {
              const d2 = (gx - gcx) * (gx - gcx) + dy2;
              if (d2 <= gr2) {
                const val = 1 - d2 / gr2;
                const idx = row + gx;
                if (val > densityGrid[idx]) densityGrid[idx] = val;
              }
            }
          }
        }

        for (let gy = 0; gy < gridH; gy++) {
          const by = gy & 3;
          const row = gy * gridW;
          for (let gx = 0; gx < gridW; gx++) {
            const idx = row + gx;
            const d = densityGrid[idx];
            const bx = gx & 3;
            const th = bayer4[by * 4 + bx];
            u32[idx] = d > th ? 0xff000000 : 0xff81a886;
          }
        }
      } else if (introActive && elapsed < 2900) {
        const dockT = (elapsed - 1400) / 1500;
        const p1 = Math.pow(dockT, 2);
        const p2 = Math.pow(1 - dockT, 3.5);
        const ease = p1 / (p1 + p2);

        progress = 50 + dockT * 42;

        const spineCount = 64;
        const discs: { x: number; y: number; r: number }[] = [];
        let prevX = 0;
        let prevY = 0;
        let prevR = 0;

        for (let i = 0; i < spineCount; i++) {
          const s = i / (spineCount - 1);
          const baseY = -60 + s * (height + 120);
          const pt = getSplinePoint(baseY);
          const targetR = isMobile ? pt.r * 0.55 : pt.r;

          const wave1 =
            Math.sin(baseY * 0.003 - time * 0.0022) *
            (isMobile ? width * 0.14 : width * 0.18);
          const wave2 =
            Math.cos(baseY * 0.006 + time * 0.0015) *
            (isMobile ? width * 0.05 : width * 0.07);
          const sway =
            Math.sin(time * 0.0016 + s * 1.2) * (isMobile ? 14 : 28);

          const sx = width * 0.52 + wave1 + wave2 + sway;
          const sy = baseY + Math.sin(baseY * 0.004 + time * 0.002) * 16;
          const sr =
            targetR * (0.85 + 0.15 * Math.sin(baseY * 0.006 - time * 0.003));

          const ambientWave =
            Math.sin(baseY * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);
          const targetX = containerLeft + containerWidth * pt.x + ambientWave;
          const targetY = baseY;

          const curX = sx + (targetX - sx) * ease;
          const curY = sy + (targetY - sy) * ease;
          const curR = sr + (targetR - sr) * ease;

          if (i > 0) {
            discs.push({
              x: (prevX + curX) * 0.5,
              y: (prevY + curY) * 0.5,
              r: (prevR + curR) * 0.5,
            });
          }
          discs.push({ x: curX, y: curY, r: curR });
          prevX = curX;
          prevY = curY;
          prevR = curR;
        }

        densityGrid.fill(0);
        for (let d = 0; d < discs.length; d++) {
          const disc = discs[d];
          const gcx = disc.x / step;
          const gcy = disc.y / step;
          const gr = disc.r / step;
          const gr2 = gr * gr;
          const minX = Math.max(0, Math.floor(gcx - gr));
          const maxX = Math.min(gridW - 1, Math.ceil(gcx + gr));
          const minY = Math.max(0, Math.floor(gcy - gr));
          const maxY = Math.min(gridH - 1, Math.ceil(gcy + gr));

          for (let gy = minY; gy <= maxY; gy++) {
            const dy2 = (gy - gcy) * (gy - gcy);
            const row = gy * gridW;
            for (let gx = minX; gx <= maxX; gx++) {
              const d2 = (gx - gcx) * (gx - gcx) + dy2;
              if (d2 <= gr2) {
                const val = 1 - d2 / gr2;
                const idx = row + gx;
                if (val > densityGrid[idx]) densityGrid[idx] = val;
              }
            }
          }
        }

        for (let gy = 0; gy < gridH; gy++) {
          const by = gy & 3;
          const row = gy * gridW;
          for (let gx = 0; gx < gridW; gx++) {
            const idx = row + gx;
            const d = densityGrid[idx];
            const bx = gx & 3;
            const th = bayer4[by * 4 + bx];
            u32[idx] = d > th ? 0xff000000 : 0xff81a886;
          }
        }
      } else if (introActive && elapsed < 3700) {
        const wipeT = (elapsed - 2900) / 800;
        progress = Math.min(100, 92 + wipeT * 8);
        uiOpacity = Math.max(0, 1 - wipeT * 1.6);

        const scanY = wipeT * (height + 160) - 80;
        const band = 80;
        const scrollY = window.scrollY;

        for (let gy = 0; gy < gridH; gy++) {
          const sy = gy * step;
          const worldY = sy + scrollY;
          const pt = getSplinePoint(worldY);
          const baseCenterX = containerLeft + containerWidth * pt.x;
          const wave =
            Math.sin(worldY * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);
          const cx = baseCenterX + wave;
          const radius = isMobile ? pt.r * 0.55 : pt.r;
          const pulse = Math.sin(worldY * 0.015 - time * 0.004) * 0.22;

          const gcx = cx / step;
          const gr = radius / step;
          const minX = Math.max(0, Math.floor(gcx - gr));
          const maxX = Math.min(gridW - 1, Math.ceil(gcx + gr));
          const by = gy & 3;
          const row = gy * gridW;

          const inSolidGreen = sy >= scanY + band;
          const inTransparent = sy <= scanY - band;

          if (inSolidGreen) {
            for (let gx = 0; gx < gridW; gx++) {
              u32[row + gx] = 0xff81a886;
            }
            for (let gx = minX; gx <= maxX; gx++) {
              const dx = Math.abs(gx - gcx);
              const norm = dx / gr;
              if (norm > 1) continue;
              const intensity = 1 - norm * norm + pulse;
              const bx = gx & 3;
              if (intensity > bayer4[by * 4 + bx]) {
                u32[row + gx] = 0xff000000;
              }
            }
          } else if (inTransparent) {
            for (let gx = 0; gx < gridW; gx++) {
              u32[row + gx] = 0x00000000;
            }
            for (let gx = minX; gx <= maxX; gx++) {
              const dx = Math.abs(gx - gcx);
              const norm = dx / gr;
              if (norm > 1) continue;
              const intensity = 1 - norm * norm + pulse;
              const bx = gx & 3;
              if (intensity > bayer4[by * 4 + bx]) {
                u32[row + gx] = 0xff81a886;
              }
            }
          } else {
            const u = (sy - (scanY - band)) / (2 * band);
            for (let gx = 0; gx < gridW; gx++) {
              const bx = gx & 3;
              u32[row + gx] =
                bayer4[by * 4 + bx] < u ? 0xff81a886 : 0x00000000;
            }
            for (let gx = minX; gx <= maxX; gx++) {
              const dx = Math.abs(gx - gcx);
              const norm = dx / gr;
              if (norm > 1) continue;
              const intensity = 1 - norm * norm + pulse;
              const bx = gx & 3;
              const th = bayer4[by * 4 + bx];
              if (intensity > th) {
                u32[row + gx] = th < u ? 0xff000000 : 0xff81a886;
              }
            }
          }
        }
      } else {
        if (introActive) {
          introActive = false;
        }

        u32.fill(0);
        const scrollY = window.scrollY;

        for (let gy = 0; gy < gridH; gy++) {
          const sy = gy * step;
          const worldY = sy + scrollY;
          const pt = getSplinePoint(worldY);
          const baseCenterX = containerLeft + containerWidth * pt.x;
          const wave =
            Math.sin(worldY * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);
          const cx = baseCenterX + wave;
          const radius = isMobile ? pt.r * 0.55 : pt.r;
          const pulse = Math.sin(worldY * 0.015 - time * 0.004) * 0.22;

          const gcx = cx / step;
          const gr = radius / step;
          const minX = Math.max(0, Math.floor(gcx - gr));
          const maxX = Math.min(gridW - 1, Math.ceil(gcx + gr));
          const by = gy & 3;
          const row = gy * gridW;

          for (let gx = minX; gx <= maxX; gx++) {
            const dx = Math.abs(gx - gcx);
            const norm = dx / gr;
            if (norm > 1) continue;
            const intensity = 1 - norm * norm + pulse;
            const bx = gx & 3;
            if (intensity > bayer4[by * 4 + bx]) {
              u32[row + gx] = 0xff81a886;
            }
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offCanvas, 0, 0, width, height);

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
  class="fixed inset-0 block {introActive
    ? 'z-50 pointer-events-none'
    : 'z-0 pointer-events-none opacity-75'}"
  style="image-rendering: pixelated;"
></canvas>

{#if introActive}
  <div
    class="fixed inset-0 z-50 pointer-events-none select-none transition-opacity duration-300"
    style="opacity: {uiOpacity};"
  >
    <div
      class="fixed top-6 left-6 md:top-8 md:left-12 flex items-center gap-4"
    >
      <img
        src="/long-logo-transparent-bg.png"
        alt="KONO"
        class="h-6 md:h-7 w-auto block filter brightness-0"
      />
    </div>

    <div
      class="fixed bottom-6 left-6 right-6 md:bottom-10 md:left-12 md:right-12 flex flex-col gap-2 text-[#000000]"
    >
      <div
        class="flex items-center justify-between text-xs tracking-widest uppercase font-mono"
      >
        <span>LOADING</span>
        <span class="tabular-nums font-mono">[{formattedProgress}%]</span>
      </div>

      <div
        class="h-2 w-full bg-[#000000]/20 p-[1px] border border-[#000000]/40"
      >
        <div
          class="h-full bg-[#000000] transition-[width] duration-200 ease-out"
          style="width: {progress}%;"
        ></div>
      </div>

      <div class="flex justify-between items-center text-[10px] tracking-widest text-[#000000]/60 uppercase pt-1 font-mono">
        &nbsp;
      </div>
    </div>
  </div>
{/if}
