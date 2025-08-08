<script lang="ts">
import { browser } from '$app/environment';
import { onMount, onDestroy } from 'svelte';

type LogoItem = {
	src: string;
	alt?: string;
	sizePx?: number; // rendered size in pixels (width & height)
	radiusPx?: number; // distance from center
	angleDeg?: number; // initial polar angle around the title center
	parallaxFactor?: number; // 0..1, how much it follows the mouse
	floatSpeed?: number; // radians per second for idle float
	floatAmpPx?: number; // amplitude of idle float
	opacity?: number; // 0..1
	zIndex?: number; // stacking; negative to stay behind title
};

const defaultItems: LogoItem[] = [
	{
		src: '/logos/svelte.svg',
		alt: 'Svelte logo',
		sizePx: 42,
		radiusPx: 120,
		angleDeg: -25,
		parallaxFactor: 0.45,
		floatSpeed: 0.9,
		floatAmpPx: 12,
		opacity: 0.95,
		zIndex: 0
	}
];

let {
	items = defaultItems,
	maxParallaxPx = 28,
	children,
	springStiffness = 100, // higher = snappier follow
	springDamping = 10 // lower than ~2*sqrt(k) for a tasteful overshoot
} = $props<{
	items?: LogoItem[];
	maxParallaxPx?: number;
	children?: any;
	springStiffness?: number;
	springDamping?: number;
}>();

let wrapper: HTMLDivElement | null = $state(null);
let slotEl: HTMLDivElement | null = $state(null);
let centerX = $state(0);
let centerY = $state(0);

// Normalized mouse position in range [-1, 1]
let mouseNX = $state(0);
let mouseNY = $state(0);
// Inertial (smoothed) mouse position
let smoothNX = $state(0);
let smoothNY = $state(0);
let velNX = $state(0);
let velNY = $state(0);

let rafId: number | null = null;
let t0: number | null = null;
let lastTs: number | null = null;

let logoEls = $state<(HTMLImageElement | null)[]>([]);
function logoRef(node: HTMLImageElement, params: { index: number }) {
	const { index } = params;
	logoEls[index] = node;
	return {
		destroy() {
			logoEls[index] = null;
		}
	};
}

function recomputeCenter() {
	if (!wrapper || !slotEl) return;
	const wr = wrapper.getBoundingClientRect();
	const sr = slotEl.getBoundingClientRect();
	centerX = sr.left - wr.left + sr.width / 2;
	centerY = sr.top - wr.top + sr.height / 2;
}

function onPointerMove(e: PointerEvent) {
	const x = e.clientX / window.innerWidth;
	const y = e.clientY / window.innerHeight;
	mouseNX = x * 2 - 1;
	mouseNY = y * 2 - 1;
}

function animate(ts: number) {
	if (!wrapper) {
		rafId = requestAnimationFrame(animate);
		return;
	}
	if (t0 == null) t0 = ts;
	const t = (ts - t0) / 1000; // seconds
	const dt = Math.min(0.05, Math.max(0.001, lastTs == null ? 0.016 : (ts - lastTs) / 1000));
	lastTs = ts;

	// Spring update for inertial mouse-follow
	{
		const k = springStiffness; // stiffness
		const c = springDamping; // damping
		const ax = k * (mouseNX - smoothNX) - c * velNX;
		const ay = k * (mouseNY - smoothNY) - c * velNY;
		velNX += ax * dt;
		velNY += ay * dt;
		smoothNX += velNX * dt;
		smoothNY += velNY * dt;
	}

	for (let i = 0; i < items.length; i += 1) {
		const item = items[i] ?? defaultItems[0];
		const el = logoEls[i];
		if (!el) continue;

		const size = item.sizePx ?? 40;
		const r = item.radiusPx ?? 100;
		const a0 = ((item.angleDeg ?? 0) * Math.PI) / 180;
		const speed = item.floatSpeed ?? 0.8;
		const amp = item.floatAmpPx ?? 10;
		const parallax = item.parallaxFactor ?? 0.4;

		const phase = i * 1.3187; // deterministic phase per item
		const a = a0 + Math.sin(t * speed + phase) * 0.12; // wobble angle slightly
		const wobbleR = r + Math.cos(t * (speed * 0.9) + phase * 0.7) * (amp * 0.35);

		const baseX = centerX + Math.cos(a) * wobbleR;
		const baseY = centerY + Math.sin(a) * wobbleR;

		const floatX = Math.sin(t * speed * 1.3 + phase) * amp;
		const floatY = Math.cos(t * speed * 1.1 + phase) * (amp * 0.6);

		const parX = smoothNX * maxParallaxPx * parallax;
		const parY = smoothNY * maxParallaxPx * parallax;

		const x = baseX + floatX + parX;
		const y = baseY + floatY + parY;

		// Apply transform; center the image on (x, y)
		el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
		el.style.width = `${size}px`;
		el.style.height = `${size}px`;
		el.style.opacity = String(item.opacity ?? 1);
		el.style.zIndex = String(item.zIndex ?? 0);
	}

	rafId = requestAnimationFrame(animate);
}

$effect(() => {
	if (!wrapper || !slotEl || !browser) return;
	const ro = new ResizeObserver(recomputeCenter);
	ro.observe(wrapper);
	ro.observe(slotEl);
	recomputeCenter();
	const onWinResize = () => recomputeCenter();
	window.addEventListener('resize', onWinResize);
	return () => {
		ro.disconnect();
		window.removeEventListener('resize', onWinResize);
	};
});

onMount(() => {
	window.addEventListener('pointermove', onPointerMove);
	rafId = requestAnimationFrame(animate);
});

onDestroy(() => {
	if (browser) window.removeEventListener('pointermove', onPointerMove);
	if (rafId != null) cancelAnimationFrame(rafId);
});
</script>

<div bind:this={wrapper} class="relative inline-block">
	<!-- Floating logos layer -->
	<div class="pointer-events-none absolute inset-0 overflow-visible">
		{#each items as item, i}
			<img
				use:logoRef={{ index: i }}
				src={item.src}
				alt={item.alt ?? ''}
				aria-hidden={item.alt ? undefined : 'true'}
				class="absolute select-none"
				draggable="false"
			/>
		{/each}
	</div>

	<!-- Title content -->
	<div bind:this={slotEl} class="relative z-10">
		{@render children?.()}
	</div>
</div>

<style>
/* No global styles; everything is scoped via classes and inline styles */
</style>
