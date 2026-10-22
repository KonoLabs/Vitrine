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

  const DOCK_START = 1400;
  const WIPE_START = 2900;
  const INTRO_END = 3700;
  const GREEN = 0xff81a886;
  const BLACK = 0xff000000;

  function smoothstep(t: number): number {
    const c = Math.min(1, Math.max(0, t));
    return c * c * (3 - 2 * c);
  }

  function dockEase(t: number): number {
    const a = t * t;
    const b = Math.pow(1 - t, 3.5);
    return a / (a + b);
  }

  onMount(() => {
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introActive = false;
    }

    let animId = 0;
    let width = 0;
    let height = 0;
    let gridW = 0;
    let gridH = 0;
    const step = 4;
    let startTime: number | null = null;

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

    function pulseAt(worldY: number, time: number): number {
      return Math.sin(worldY * 0.015 - time * 0.004) * 0.22;
    }

    function ambientWave(worldY: number, time: number, isMobile: boolean) {
      return Math.sin(worldY * 0.0028 - time * 0.0016) * (isMobile ? 12 : 26);
    }

    function drawSwimming(time: number, dock: number, isMobile: boolean) {
      const containerWidth = Math.min(width, 1440);
      const containerLeft = (width - containerWidth) / 2;
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
        const sway = Math.sin(time * 0.0016 + s * 1.2) * (isMobile ? 14 : 28);

        const sx = width * 0.52 + wave1 + wave2 + sway;
        const sy = baseY + Math.sin(baseY * 0.004 + time * 0.002) * 16;
        const sr =
          targetR * (0.85 + 0.15 * Math.sin(baseY * 0.006 - time * 0.003));

        const targetX =
          containerLeft +
          containerWidth * pt.x +
          ambientWave(baseY, time, isMobile);

        const curX = sx + (targetX - sx) * dock;
        const curY = sy + (baseY - sy) * dock;
        const curR = sr + (targetR - sr) * dock;

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
      for (const disc of discs) {
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
        const pulse = pulseAt(gy * step, time) * dock;
        for (let gx = 0; gx < gridW; gx++) {
          const idx = row + gx;
          const d = densityGrid[idx];
          const th = bayer4[by * 4 + (gx & 3)];
          u32[idx] = d > 0 && d + pulse > th ? BLACK : GREEN;
        }
      }
    }

    function drawDocked(
      time: number,
      wipeT: number | null,
      isMobile: boolean,
    ) {
      const containerWidth = Math.min(width, 1440);
      const containerLeft = (width - containerWidth) / 2;
      const scrollY = window.scrollY;
      const band = 80;
      const scanY = wipeT === null ? 0 : wipeT * (height + 160) - 80;

      for (let gy = 0; gy < gridH; gy++) {
        const sy = gy * step;
        const worldY = sy + scrollY;
        const pt = getSplinePoint(worldY);
        const cx =
          containerLeft +
          containerWidth * pt.x +
          ambientWave(worldY, time, isMobile);
        const radius = isMobile ? pt.r * 0.55 : pt.r;
        const pulse = pulseAt(worldY, time);

        const gcx = cx / step;
        const gr = radius / step;
        const minX = Math.max(0, Math.floor(gcx - gr));
        const maxX = Math.min(gridW - 1, Math.ceil(gcx + gr));
        const by = gy & 3;
        const row = gy * gridW;

        const u =
          wipeT === null ? 0 : smoothstep((sy - (scanY - band)) / (2 * band));

        for (let gx = 0; gx < gridW; gx++) {
          u32[row + gx] = bayer4[by * 4 + (gx & 3)] < u ? GREEN : 0;
        }
        for (let gx = minX; gx <= maxX; gx++) {
          const norm = Math.abs(gx - gcx) / gr;
          if (norm > 1) continue;
          const th = bayer4[by * 4 + (gx & 3)];
          if (1 - norm * norm + pulse > th) {
            u32[row + gx] = th < u ? BLACK : GREEN;
          }
        }
      }
    }

    function render(time: number) {
      if (!offCtx || !u32 || !densityGrid) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const isMobile = width < 768;

      const wipePhase =
        introActive && elapsed >= WIPE_START && elapsed < INTRO_END;
      if (wiping !== wipePhase) wiping = wipePhase;
      if (introActive) {
        const t = Math.min(1, elapsed / INTRO_END);
        progress = 100 * (1 - (1 - t) * (1 - t));
      }

      if (introActive && elapsed < WIPE_START) {
        const dock =
          elapsed < DOCK_START
            ? 0
            : dockEase((elapsed - DOCK_START) / (WIPE_START - DOCK_START));
        drawSwimming(time, dock, isMobile);
      } else if (introActive && elapsed < INTRO_END) {
        const wipeT = (elapsed - WIPE_START) / (INTRO_END - WIPE_START);
        uiOpacity = 1 - smoothstep(wipeT * 1.6);
        drawDocked(time, wipeT, isMobile);
      } else {
        if (introActive) introActive = false;
        drawDocked(time, null, isMobile);
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
  class="fixed inset-0 block pointer-events-none transition-opacity duration-1000 ease-out {introActive
    ? 'z-50'
    : 'z-0 opacity-75'}"
  style="image-rendering: pixelated;"
></canvas>

{#if introActive}
  <div
    class="fixed inset-0 z-50 pointer-events-none select-none"
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
          class="h-full bg-[#000000] origin-left"
          style="transform: scaleX({progress / 100});"
        ></div>
      </div>
    </div>
  </div>
{/if}
