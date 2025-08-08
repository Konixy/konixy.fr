<script lang="ts">
import { onMount, onDestroy } from 'svelte';
const text = 'Anatole Dufour';

const baseWeight = 300;
const maxWeight = 900;
const influenceRadiusPx = 140; // Horizontal influence radius in px

// Idle sweep animation configuration
const sweepDurationMs = 1500; // duration of one sweep
const sweepLettersEmphasized = 4; // approx number of letters emphasized at once

const letters = $state<string[]>(text.split(''));

let container: HTMLDivElement | null = $state(null);
let spanRefs = $state<(HTMLSpanElement | null)[]>([]);
let centerXs = $state<number[]>([]);

let isHovered = $state(false);

function spanRef(node: HTMLSpanElement, params: { index: number }) {
	const { index } = params;
	spanRefs[index] = node;
	return {
		destroy() {
			spanRefs[index] = null;
		}
	};
}

function computeCenters() {
	if (!container) return;
	const containerRect = container.getBoundingClientRect();
	for (let i = 0; i < spanRefs.length; i += 1) {
		const spanEl = spanRefs[i];
		if (!spanEl) {
			centerXs[i] = 0;
			continue;
		}
		const r = spanEl.getBoundingClientRect();
		// Fix width to avoid layout shift while animating weight
		spanEl.style.width = `${r.width}px`;
		centerXs[i] = r.left - containerRect.left + r.width / 2;
	}
}

let rafId: number | null = null;
let pendingMouseX: number | null = null;

function scheduleUpdate(mouseClientX: number) {
	if (!container) return;
	const containerRect = container.getBoundingClientRect();
	pendingMouseX = mouseClientX - containerRect.left;
	if (rafId != null) return;
	rafId = requestAnimationFrame(() => {
		if (pendingMouseX == null) {
			rafId = null;
			return;
		}
		updateFrame(pendingMouseX);
		rafId = null;
	});
}

function updateFrame(mouseX: number) {
	// Imperatively update styles to avoid Svelte reactivity overhead per letter
	for (let i = 0; i < spanRefs.length; i += 1) {
		const spanEl = spanRefs[i];
		if (!spanEl) continue;
		const centerX = centerXs[i] ?? 0;
		const dx = Math.abs(centerX - mouseX);
		const t = Math.min(1, dx / influenceRadiusPx);
		const influence = Math.exp(-4 * t * t);
		const targetWeight = Math.round(baseWeight + (maxWeight - baseWeight) * influence);
		// Only write if changed to reduce style churn
		if ((spanEl as any)._w !== targetWeight) {
			(spanEl as any)._w = targetWeight;
			spanEl.style.fontWeight = String(targetWeight);
		}
	}
}

function handleMouseMove(event: MouseEvent) {
	if (!isHovered) return;
	scheduleUpdate(event.clientX);
}

function handleMouseEnter(event: MouseEvent) {
	isHovered = true;
	// cancel any ongoing sweep animation
	if (sweepRafId != null) {
		cancelAnimationFrame(sweepRafId);
		sweepRafId = null;
	}
	isAnimatingSweep = false;
	computeCenters();
	scheduleUpdate(event.clientX);
}

function handleMouseLeave() {
	isHovered = false;
	pendingMouseX = null;
	if (rafId != null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}
	// Reset weights
	for (const spanEl of spanRefs) {
		if (!spanEl) continue;
		(spanEl as any)._w = baseWeight;
		spanEl.style.fontWeight = String(baseWeight);
	}
}

// Recompute centers when container resizes
$effect(() => {
	if (!container) return;
	const ro = new ResizeObserver(() => computeCenters());
	ro.observe(container);
	computeCenters();
	const onWindowResize = () => computeCenters();
	window.addEventListener('resize', onWindowResize);
	return () => {
		ro.disconnect();
		window.removeEventListener('resize', onWindowResize);
	};
});

// -----------------------------
// Idle sweep animation every 5s
// -----------------------------
let sweepIntervalId: number | null = null;
let sweepRafId: number | null = null;
let isAnimatingSweep = false;

function easeInOutCubic(x: number) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function runSweepOnce() {
	if (!container) return;
	isAnimatingSweep = true;
	const containerRect = container.getBoundingClientRect();
	const containerWidth = containerRect.width || 1;
	const positions = centerXs.map((x) => x / containerWidth);

	let start: number | null = null;
	function step(ts: number) {
		if (!isAnimatingSweep) {
			sweepRafId = null;
			return;
		}
		if (isHovered) {
			isAnimatingSweep = false;
			sweepRafId = null;
			return;
		}
		if (start == null) start = ts;
		const t = Math.min(1, (ts - start) / sweepDurationMs);
		const sweep = easeInOutCubic(t);
		// Convert desired letter emphasis count to a normalized gaussian sigma
		const sigma = (sweepLettersEmphasized / Math.max(1, letters.length)) * 0.5;
		const twoSigma2 = 2 * sigma * sigma;
		// Global envelope to fade in/out the sweep energy at the start/end
		const envelope = Math.sin(Math.PI * t);

		for (let i = 0; i < spanRefs.length; i += 1) {
			const spanEl = spanRefs[i];
			if (!spanEl) continue;
			const pos = positions[i] ?? 0;
			const d = pos - sweep;
			const influence = Math.exp(-(d * d) / twoSigma2) * envelope;
			const targetWeight = Math.round(baseWeight + (maxWeight - baseWeight) * influence);
			if ((spanEl as any)._w !== targetWeight) {
				(spanEl as any)._w = targetWeight;
				spanEl.style.fontWeight = String(targetWeight);
			}
		}

		if (t < 1) {
			sweepRafId = requestAnimationFrame(step);
		} else {
			// ensure clean reset at end when idle
			if (!isHovered) {
				for (const spanEl of spanRefs) {
					if (!spanEl) continue;
					(spanEl as any)._w = baseWeight;
					spanEl.style.fontWeight = String(baseWeight);
				}
			}
			isAnimatingSweep = false;
			sweepRafId = null;
		}
	}

	sweepRafId = requestAnimationFrame(step);
}

onMount(() => {
	sweepIntervalId = window.setInterval(() => {
		if (isHovered || isAnimatingSweep) return;
		if (!container || spanRefs.length === 0) return;
		computeCenters();
		runSweepOnce();
	}, 5000);
});

onDestroy(() => {
	if (sweepIntervalId != null) {
		clearInterval(sweepIntervalId);
		sweepIntervalId = null;
	}
	if (sweepRafId != null) {
		cancelAnimationFrame(sweepRafId);
		sweepRafId = null;
	}
});
</script>

<div
	bind:this={container}
	class="text-center font-sans text-6xl select-none"
	role="heading"
	aria-level="1"
	aria-label={text}
	onmousemove={handleMouseMove}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	{#each letters as ch, i}
		<span
			use:spanRef={{ index: i }}
			style="font-weight: {baseWeight}; transition: font-weight 120ms ease; display: inline-block; will-change: font-weight; letter-spacing: 0px"
		>
			{ch === ' ' ? '\u00A0' : ch}
		</span>
	{/each}
</div>
