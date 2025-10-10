<script lang="ts">
import ArrowRight from '@tabler/icons-svelte/icons/arrow-right';
import { gsap } from 'gsap';
import { onMount } from 'svelte';

let { repoCount }: { repoCount: number } = $props();

let bentoSection: HTMLDivElement | null = $state(null);
let headerSection: HTMLDivElement | null = $state(null);
let gridContainer: HTMLDivElement | null = $state(null);
let footerLink: HTMLDivElement | null = $state(null);

type Project = {
	name: string;
	description: string;
	link: string;
	colSpan: number;
	rowSpan: number;
	external?: boolean;
};

const projects: Project[] = [
	{
		name: 'djPilot',
		description: 'djPilot is a web app that allows you to manage your gigs and many other things.',
		link: 'https://djpilot.app',
		external: true,
		colSpan: 2,
		rowSpan: 4
	},
	{
		name: 'Threejs Journey',
		description: 'A threejs course I followed.',
		link: 'https://threejs-journey.com/',
		external: true,
		colSpan: 1,
		rowSpan: 4
	},
	{
		name: 'Groupie Tracker',
		description: 'A Zone01 project I did with a friend.',
		link: 'https://groupie-tracker.konixy.fr/',
		external: true,
		colSpan: 1,
		rowSpan: 4
	},
	{
		name: 'Better Svelte Email',
		description:
			'An open-source library that I built for sending emails with Svelte and tailwindcss.',
		link: 'https://github.com/Konixy/better-svelte-email',
		external: true,
		colSpan: 1,
		rowSpan: 3
	},
	{
		name: 'Home Lab',
		description: 'A home server at my parents house running various services.',
		link: '/home-lab',
		external: false,
		colSpan: 1,
		rowSpan: 6
	},
	{
		name: 'Chat NextJS',
		description: 'A chat app built with NextJS, GraphQL, and TailwindCSS.',
		link: 'https://chat.konixy.fr',
		external: true,
		colSpan: 1,
		rowSpan: 3
	},
	{
		name: 'Chat Svelte',
		description: 'The same chat app, but in SvelteKit.',
		link: 'https://chat-svelte.konixy.fr',
		external: true,
		colSpan: 1,
		rowSpan: 2
	}
];

onMount(() => {
	const ctx = gsap.context(() => {
		if (!bentoSection || !headerSection || !gridContainer || !footerLink) return;

		// Animate header section
		gsap.from(headerSection.children, {
			y: 30,
			opacity: 0,
			duration: 1,
			stagger: 0.15,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: headerSection,
				start: 'top 90%',
				toggleActions: 'play none none reverse'
			}
		});

		// Animate each grid item individually as it enters the viewport
		Array.from(gridContainer.children).forEach((card) => {
			gsap.from(card, {
				y: 40,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 95%',
					toggleActions: 'play none none reverse'
				}
			});
		});

		// Animate footer link
		gsap.from(footerLink, {
			y: 20,
			opacity: 0,
			duration: 1,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: footerLink,
				start: 'top 95%',
				toggleActions: 'play none none reverse'
			}
		});

		// Subtle parallax effect on scroll
		gsap.to(bentoSection, {
			y: -30,
			ease: 'none',
			scrollTrigger: {
				trigger: bentoSection,
				start: 'top bottom',
				end: 'bottom top',
				scrub: 1.5
			}
		});
	});

	return () => ctx.revert();
});
</script>

<div bind:this={bentoSection} class="flex h-full flex-col items-center justify-center gap-10">
	<div bind:this={headerSection} class="flex flex-col gap-4 text-center">
		<div class="text-foreground text-xl font-bold">Projects</div>
		<p class="text-foreground/60 text-sm">Here are some of the projects I've worked on.</p>
	</div>
	<div
		bind:this={gridContainer}
		class="grid h-full w-full max-w-7xl grid-cols-1 grid-rows-10 gap-4 rounded-lg px-6 shadow-md md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:px-10"
	>
		{#each projects as project}
			<a
				href={project.link}
				target={project.external ? '_blank' : undefined}
				class="bg-foreground/5 group border-foreground/10 hover:bg-foreground/10 hover:border-foreground/20 flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-all *:transition-all not-md:col-span-1! not-md:row-span-2!"
				style={`grid-column: span ${project.colSpan}; grid-row: span ${project.rowSpan}`}
			>
				<div class="text-foreground/60 group-hover:text-foreground text-xl font-bold">
					{project.name}
				</div>
				<p class="text-foreground/40 group-hover:text-foreground/60 text-sm">
					{project.description}
				</p>
			</a>
		{/each}
	</div>

	<div bind:this={footerLink} class="flex items-center">
		<a
			class="group text-foreground/60 hover:text-foreground flex items-center gap-1 transition-all"
			href="https://github.com/Konixy?tab=repositories"
			target="_blank"
		>
			View {repoCount - projects.length} more projects on my GitHub
			<ArrowRight class="size-4 transition-all group-hover:translate-x-1" />
		</a>
	</div>
</div>
