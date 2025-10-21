<script lang="ts">
import { SiGithub, SiInstagram, SiX } from '@icons-pack/svelte-simple-icons';
import Link from '$lib/components/icon-link.svelte';
import Button from '$lib/components/button.svelte';
import { gsap } from 'gsap';
import Projects from './projects.svelte';
import type { PageData } from './$types';
import { IconChevronsDown } from '@tabler/icons-svelte';
import LinkedinLogo from '$lib/components/linkedin-logo.svelte';
import confetti from 'canvas-confetti';
import Download from '@tabler/icons-svelte/icons/download';

let { data }: { data: PageData } = $props();

let heroSection: HTMLDivElement | null = $state(null);

$effect(() => {
	// Initial animation on page load
	const ctx = gsap.context(() => {
		if (!heroSection) return;
		heroSection.classList.add('opacity-100');

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

function onclick() {
	window.open('/CV.pdf', '_blank');
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 }
	});
}
</script>

<div
	bind:this={heroSection}
	class="relative flex h-screen flex-col items-center justify-center gap-10 text-center opacity-0"
>
	<div class="pointer-events-none relative size-16 overflow-hidden rounded-full">
		<img src="/me.jpeg" alt="Anatole Dufour" class="absolute inset-0 h-full w-full object-cover" />
	</div>
	<div class="font-title text-5xl font-bold tracking-normal sm:text-6xl">Anatole Dufour</div>
	<div class="motion text-foreground/60 flex flex-row items-center gap-2 text-xl font-light">
		<p>18'</p>
		⸱
		<p>Fullstack developer</p>
		⸱
		<p>France 🇫🇷</p>
	</div>
	<div>
		<Button class="flex flex-row items-center gap-2" {onclick}>
			<Download class="size-5" /> Download CV
		</Button>
	</div>
	<div class="flex flex-row items-center gap-8">
		<Link href="https://github.com/Konixy">
			<SiGithub size={20} />
		</Link>
		<Link href="https://linkedin.com/in/anatole-dufour/">
			<LinkedinLogo class="size-5" />
		</Link>
		<Link href="https://x.com/anatoleduf">
			<SiX size={18} />
		</Link>
		<Link href="https://instagram.com/anatole.music">
			<SiInstagram size={18} />
		</Link>
	</div>
	<div>
		<button
			onclick={() => {
				window.scrollTo({
					top: window.innerHeight,
					behavior: 'smooth'
				});
			}}
			class="group text-foreground/30 hover:text-foreground/60 absolute -bottom-20 left-1/2 -translate-x-1/2 cursor-pointer transition-all"
		>
			<IconChevronsDown
				class="size-6 transition-transform duration-300 group-hover:translate-y-1"
			/>
		</button>
	</div>
</div>

<Projects repoCount={data.repoCount} />
