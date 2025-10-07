<script lang="ts">
import {
	GitHubLogo,
	InstagramLogo,
	LinkedInLogo,
	XformerlyTwitterLogo
} from '@selemondev/svgl-svelte';
import Link from '$lib/components/icon-link.svelte';
import Aurora from '$lib/components/aurora.svelte';
import Button from '$lib/components/button.svelte';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMount } from 'svelte';
import Bento from './bento.svelte';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

gsap.registerPlugin(ScrollTrigger);

let heroSection: HTMLDivElement | null = $state(null);

onMount(() => {
	// Initial animation on page load
	const ctx = gsap.context(() => {
		if (!heroSection) return;
		// Animate all children elements with a stagger
		gsap.from(heroSection.children, {
			y: 30,
			opacity: 0,
			duration: 1,
			stagger: 0.1,
			ease: 'power3.out',
			delay: 0.2
		});

		// Fade out animation when scrolling down
		gsap.to(heroSection, {
			opacity: 0,
			y: -50,
			ease: 'power2.inOut',
			scrollTrigger: {
				trigger: heroSection,
				start: 'center center',
				end: 'bottom top',
				scrub: 1.5
			}
		});
	});

	return () => ctx.revert();
});
</script>

<div
	bind:this={heroSection}
	class="flex h-screen flex-col items-center justify-center gap-10 text-center"
>
	<div class="pointer-events-none relative h-16 w-16 overflow-hidden rounded-full">
		<img src="/me.jpeg" alt="Anatole Dufour" class="absolute inset-0 h-full w-full object-cover" />
	</div>
	<div class="font-title text-5xl font-bold sm:text-6xl">Anatole Dufour</div>
	<div class="motion text-foreground/60 flex flex-row items-center gap-2 text-xl font-light">
		<p>18'</p>
		⸱
		<p>Fullstack developer</p>
		⸱
		<p>France 🇫🇷</p>
	</div>
	<div>
		<Button href="mailto:anatole.duf@gmail.com">Contact me</Button>
	</div>
	<div class="flex flex-row gap-8">
		<Link href="https://github.com/Konixy">
			<GitHubLogo class="size-5" />
		</Link>
		<Link href="https://linkedin.com/in/anatole-dufour/">
			<LinkedInLogo class="size-5" />
		</Link>
		<Link href="https://x.com/anatoleduf">
			<XformerlyTwitterLogo class="size-4" />
		</Link>
		<Link href="https://instagram.com/anatole.music">
			<InstagramLogo class="size-5" />
		</Link>
	</div>
</div>

<!-- <Bento repoCount={data.repoCount} /> -->
