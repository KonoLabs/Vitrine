<script lang="ts">
  import { onMount } from "svelte";

  let {
    src = "/models/fieldcam.glb",
    label = "FIELD CAM · CONTROLLER PCB",
  }: { src?: string; label?: string } = $props();

  type Preset = "iso" | "top" | "side";

  let host: HTMLDivElement;
  let status = $state<"idle" | "loading" | "ready" | "error">("idle");
  let preset = $state<Preset>("iso");
  let rotating = $state(true);

  // Three.js objects live outside reactive state: they are large, mutable and
  // must never be proxied.
  let viewer: {
    applyPreset: (preset: Preset) => void;
    setRotating: (value: boolean) => void;
  } | null = null;

  function choosePreset(next: Preset) {
    preset = next;
    rotating = false;
    viewer?.setRotating(false);
    viewer?.applyPreset(next);
  }

  function toggleRotate() {
    rotating = !rotating;
    viewer?.setRotating(rotating);
  }

  onMount(() => {
    if (!host) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rotating = !reducedMotion;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function boot() {
      if (disposed || status !== "idle") return;
      status = "loading";

      try {
        const [THREE, { OrbitControls }, { GLTFLoader }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/controls/OrbitControls.js"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
        ]);

        if (disposed) return;

        const width = host.clientWidth || 800;
        const height = host.clientHeight || 480;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.cursor = "grab";
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(
          32,
          width / height,
          0.1,
          5000,
        );

        scene.add(new THREE.HemisphereLight(0xffffff, 0x141414, 1.5));
        const key = new THREE.DirectionalLight(0xffffff, 2.4);
        key.position.set(70, 130, 90);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xbfd7c0, 0.9);
        fill.position.set(-90, 70, -70);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0xffffff, 0.5);
        rim.position.set(0, -80, -60);
        scene.add(rim);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.075;
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 0.7;
        controls.enablePan = false;
        controls.autoRotateSpeed = 1.5;
        controls.minPolarAngle = 0.02;
        controls.maxPolarAngle = Math.PI - 0.02;

        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(src);
        if (disposed) return;

        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const center = sphere.center.clone();
        const radius = Math.max(sphere.radius, 1);

        camera.near = radius / 100;
        camera.far = radius * 100;
        camera.updateProjectionMatrix();

        // Fit the board's bounding sphere, then pull in slightly. The sphere
        // is the worst-case diagonal, so 88% of its fit distance still keeps
        // the board inside the frame at every orbit angle the clamp allows.
        const distance =
          (radius / Math.sin(((camera.fov / 2) * Math.PI) / 180)) * 0.88;
        controls.minDistance = distance * 0.35;
        controls.maxDistance = distance * 3;
        controls.target.copy(center);

        const directions = {
          iso: new THREE.Vector3(1, 0.92, 1).normalize(),
          top: new THREE.Vector3(0, 1, 0.0015).normalize(),
          side: new THREE.Vector3(1, 0.34, 0.08).normalize(),
        };

        camera.position
          .copy(center)
          .add(directions.iso.clone().multiplyScalar(distance));
        controls.update();

        let transition: {
          start: number;
          fromPosition: typeof camera.position;
          toPosition: typeof camera.position;
          fromTarget: typeof controls.target;
          toTarget: typeof controls.target;
        } | null = null;

        function applyPreset(next: Preset, animate = true) {
          const toPosition = center
            .clone()
            .add(directions[next].clone().multiplyScalar(distance));

          if (!animate) {
            camera.position.copy(toPosition);
            controls.target.copy(center);
            controls.update();
            return;
          }

          transition = {
            start: performance.now(),
            fromPosition: camera.position.clone(),
            toPosition,
            fromTarget: controls.target.clone(),
            toTarget: center.clone(),
          };
        }

        function setRotating(value: boolean) {
          controls.autoRotate = value;
        }

        controls.addEventListener("start", () => {
          rotating = false;
          controls.autoRotate = false;
        });

        controls.autoRotate = rotating;
        controls.update();

        const frame = () => {
          if (transition) {
            const progress = Math.min(
              1,
              (performance.now() - transition.start) / 650,
            );
            const eased = 1 - Math.pow(1 - progress, 3);
            camera.position.lerpVectors(
              transition.fromPosition,
              transition.toPosition,
              eased,
            );
            controls.target.lerpVectors(
              transition.fromTarget,
              transition.toTarget,
              eased,
            );
            if (progress >= 1) transition = null;
          }
          controls.update();
          renderer.render(scene, camera);
        };

        renderer.setAnimationLoop(frame);

        const resize = () => {
          const w = host.clientWidth;
          const h = host.clientHeight;
          if (!w || !h) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);

        viewer = {
          applyPreset: (next) => applyPreset(next),
          setRotating,
        };

        status = "ready";

        cleanup = () => {
          observer.disconnect();
          renderer.setAnimationLoop(null);
          controls.dispose();
          scene.traverse((object: any) => {
            if (!object.isMesh) return;
            object.geometry?.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            for (const material of materials) {
              if (!material) continue;
              for (const value of Object.values(material)) {
                if ((value as any)?.isTexture) (value as any).dispose();
              }
              material.dispose();
            }
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch (error) {
        console.error("3d viewer failed", error);
        status = "error";
      }
    }

    if (!("IntersectionObserver" in window)) {
      boot();
      return () => cleanup?.();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          boot();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(host);

    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
      viewer = null;
    };
  });
</script>

<div
  class="relative w-full h-[340px] sm:h-[460px] lg:h-[560px] bg-[#000000] overflow-hidden"
>
  <div bind:this={host} class="absolute inset-0" aria-hidden="true"></div>

  <div
    class="absolute top-0 left-0 right-0 flex flex-wrap items-center justify-between gap-2 p-3 md:p-4 pointer-events-none"
  >
    <span
      class="text-[10px] uppercase tracking-widest text-[#88A888] bg-[#000000]/70 px-2 py-1"
    >
      {label}
    </span>

    {#if status === "ready"}
      <div class="flex gap-1.5 pointer-events-auto">
        {#each ["iso", "top", "side"] as option}
          <button
            type="button"
            onclick={() => choosePreset(option)}
            class="px-2.5 py-1 text-[10px] uppercase tracking-widest border transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#88A888] {preset ===
            option
              ? 'bg-[#88A888] text-[#000000] border-[#88A888]'
              : 'bg-[#000000]/70 text-[#FFFFFF]/70 border-border-subtle hover:text-[#FFFFFF]'}"
            aria-pressed={preset === option}
          >
            {option}
          </button>
        {/each}
        <button
          type="button"
          onclick={toggleRotate}
          class="px-2.5 py-1 text-[10px] uppercase tracking-widest border transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#88A888] {rotating
            ? 'bg-[#88A888] text-[#000000] border-[#88A888]'
            : 'bg-[#000000]/70 text-[#FFFFFF]/70 border-border-subtle hover:text-[#FFFFFF]'}"
          aria-pressed={rotating}
        >
          auto
        </button>
      </div>
    {/if}
  </div>

  {#if status === "idle" || status === "loading"}
    <div
      class="absolute inset-0 flex items-center justify-center bg-[#000000]/60 pointer-events-none"
    >
      <span class="text-[10px] uppercase tracking-widest text-[#88A888]">
        loading board…
      </span>
    </div>
  {:else if status === "error"}
    <div
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
    >
      <span class="text-[10px] uppercase tracking-widest text-[#88A888]">
        3d view unavailable
      </span>
      <span class="text-[11px] text-[#FFFFFF]/60">
        This browser could not start WebGL.
      </span>
    </div>
  {:else}
    <div
      class="absolute bottom-0 left-0 right-0 p-3 md:p-4 pointer-events-none"
    >
      <span
        class="text-[10px] uppercase tracking-widest text-[#FFFFFF]/45 bg-[#000000]/60 px-2 py-1"
      >
        drag · orbit — scroll · zoom
      </span>
    </div>
  {/if}
</div>
