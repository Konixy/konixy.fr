<script lang="ts">
import { cn } from '$lib/utils';
import {
	SiSvelte,
	SiTailwindcss,
	SiTypescript,
	SiPrisma,
	SiMongodb,
	SiGo,
	SiCss,
	SiNextdotjs,
	SiDocker,
	SiLinux,
	SiGraphql,
	SiArchlinux,
	SiReact
} from '@icons-pack/svelte-simple-icons';
import ArrowRight from '@tabler/icons-svelte/icons/arrow-right';
import { gsap } from 'gsap';
import { onMount } from 'svelte';

let { repoCount }: { repoCount: number } = $props();

let sectionEl: HTMLDivElement | null = $state(null);
let headingEl: HTMLDivElement | null = $state(null);
let heroEl: HTMLDivElement | null = $state(null);
let timelineEl: HTMLDivElement | null = $state(null);
let footerLink: HTMLDivElement | null = $state(null);

type Language =
	| 'typescript'
	| 'svelte'
	| 'tailwindcss'
	| 'prisma'
	| 'mongodb'
	| 'golang'
	| 'css'
	| 'react'
	| 'nextjs'
	| 'graphql'
	| 'docker'
	| 'linux'
	| 'arch-linux';

type Project = {
	name: string;
	description: string;
	type: string;
	link: string;
	languages: Language[];
	external?: boolean;
};

const projects: Project[] = [
	{
		name: 'djPilot',
		description:
			"djPilot is a SaaS of my creation that allows it's users to manage their gigs, invoices, client relationships and more.\nAs a DJ myself, I know how much time it can take to manage all of this, so I decided to create a tool that would help me and other DJs to manage their gigs, invoices, client relationships and more.",
		type: 'live product',
		link: 'https://djpilot.app',
		languages: ['svelte', 'tailwindcss', 'typescript', 'prisma', 'mongodb', 'docker'],
		external: true
	},
	{
		name: 'Better Svelte Email',
		description:
			'An open-source library that I built for sending emails with Svelte and tailwindcss.',
		type: 'open source',
		link: 'https://github.com/Konixy/better-svelte-email',
		languages: ['typescript', 'svelte', 'tailwindcss'],
		external: true
	},
	{
		name: 'Groupie Tracker',
		description: 'A Zone01 project I did with a friend.',
		type: 'school project',
		link: 'https://groupie-tracker.konixy.fr/',
		languages: ['svelte', 'golang', 'css'],
		external: true
	},
	{
		name: 'Home Lab',
		description: 'A home server at my parents house running various services.',
		type: 'personal project',
		link: '/home-lab',
		languages: ['arch-linux', 'docker'],
		external: false
	},
	{
		name: 'Chat App',
		description:
			'A chat app I built two times, first with NextJS and then another time to learn SvelteKit.',
		type: 'learning project',
		link: 'https://chat-svelte.konixy.fr',
		languages: ['svelte', 'react', 'nextjs', 'graphql', 'tailwindcss', 'typescript'],
		external: true
	}
];

const featuredProject = projects[0];
const otherProjects = projects.slice(1);

const pad = (value: number) => value.toString().padStart(2, '0');

onMount(() => {
	const ctx = gsap.context(() => {
		if (!sectionEl) return;

		if (headingEl) {
			gsap.from(headingEl, {
				y: 30,
				opacity: 0,
				duration: 1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: headingEl,
					start: 'top 90%',
					toggleActions: 'play none none reverse'
				}
			});
		}

		if (heroEl) {
			gsap.from(heroEl, {
				y: 40,
				opacity: 0,
				duration: 1.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: heroEl,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		}

		if (timelineEl) {
			gsap.from(timelineEl, {
				opacity: 0,
				duration: 0.9,
				y: 30,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: timelineEl,
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		}

		gsap.utils.toArray<HTMLElement>('[data-animate="timeline"]').forEach((card, index) => {
			gsap.from(card, {
				y: 50,
				opacity: 0,
				duration: 1,
				delay: index * 0.05,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 95%',
					toggleActions: 'play none none none'
				}
			});
		});

		if (footerLink) {
			gsap.from(footerLink, {
				y: 20,
				opacity: 0,
				duration: 1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: footerLink,
					start: 'top 95%',
					toggleActions: 'play none none none'
				}
			});
		}
	}, sectionEl ?? undefined);

	return () => ctx.revert();
});

function getLanguageColor(language: Language) {
	switch (language) {
		case 'svelte':
			return 'bg-svelte/10 text-svelte';
		case 'tailwindcss':
			return 'bg-tailwindcss/10 text-tailwindcss';
		case 'typescript':
			return 'bg-typescript/10 text-typescript';
		case 'prisma':
			return 'bg-prisma/10 text-prisma';
		case 'mongodb':
			return 'bg-mongodb/10 text-mongodb';
		case 'golang':
			return 'bg-golang/10 text-golang';
		case 'css':
			return 'bg-css/10 text-css';
		case 'react':
			return 'bg-react/10 text-react';
		case 'nextjs':
			return 'bg-nextjs/10 text-nextjs';
		case 'graphql':
			return 'bg-graphql/10 text-graphql';
		case 'docker':
			return 'bg-docker/10 text-docker';
		case 'linux':
			return 'bg-linux/10 text-linux';
		case 'arch-linux':
			return 'bg-arch-linux/10 text-arch-linux';
	}
}

function getLanguageIcon(language: Language) {
	switch (language) {
		case 'svelte':
			return SiSvelte;
		case 'tailwindcss':
			return SiTailwindcss;
		case 'typescript':
			return SiTypescript;
		case 'prisma':
			return SiPrisma;
		case 'mongodb':
			return SiMongodb;
		case 'golang':
			return SiGo;
		case 'css':
			return SiCss;
		case 'react':
			return SiReact;
		case 'nextjs':
			return SiNextdotjs;
		case 'graphql':
			return SiGraphql;
		case 'docker':
			return SiDocker;
		case 'linux':
			return SiLinux;
		case 'arch-linux':
			return SiArchlinux;
	}
}
</script>

<div bind:this={sectionEl} class="relative mb-24 w-full overflow-hidden px-6 pt-16 pb-24">
	<div class="relative mx-auto flex w-full max-w-6xl flex-col gap-16">
		<div bind:this={headingEl} class="flex flex-col items-center gap-3 text-center">
			<span class="text-foreground/60 text-xs tracking-[0.35em] uppercase">Selected work</span>
			<h1 class="text-foreground text-4xl font-semibold sm:text-5xl">Projects</h1>
			<p class="text-foreground/50 max-w-2xl text-sm sm:text-base">
				A collection of products, experiments and community tools I've shipped over the years. Each
				project taught me something new about building expressive web experiences.
			</p>
		</div>

		{#if featuredProject}
			<div
				bind:this={heroEl}
				class="bg-foreground text-background relative overflow-hidden rounded-3xl backdrop-blur"
			>
				<div class="grid grid-cols-1 md:grid-cols-[1.2fr,1fr]">
					<div class="flex flex-col gap-6 p-10 md:p-12">
						<span class="text-background/40 text-xs tracking-[0.4em] uppercase">Spotlight</span>
						<div class="flex flex-col gap-3">
							<h2 class="text-3xl font-semibold sm:text-4xl">
								{featuredProject.name}
							</h2>
							<p class="text-background/60 text-sm whitespace-pre-line sm:text-base">
								{featuredProject.description}
							</p>
						</div>
						<div class="flex flex-wrap items-center gap-3">
							{#each featuredProject.languages as language}
								{@const Logo = getLanguageIcon(language)}
								<span
									class={cn(
										getLanguageColor(language),
										'bg-background/5 flex flex-row items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium'
									)}
								>
									<Logo size={16} color="currentColor" />
									<span class="text-background/60">
										{language}
									</span>
								</span>
							{/each}
						</div>
						<div class="flex flex-wrap items-center gap-4">
							<a
								href={featuredProject.link}
								target={featuredProject.external ? '_blank' : undefined}
								rel={featuredProject.external ? 'noreferrer noopener' : undefined}
								class="bg-background/90 group text-foreground hover:bg-background inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all"
							>
								Visit project
								<ArrowRight class="size-4 transition-all group-hover:translate-x-1" />
							</a>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div bind:this={timelineEl} class="relative mx-auto w-full max-w-6xl">
			<div class="flex flex-col gap-8">
				{#each otherProjects as project, index (project.name)}
					<a
						data-animate="timeline"
						href={project.link}
						target={project.external ? '_blank' : undefined}
						rel={project.external ? 'noreferrer noopener' : undefined}
						class="group bg-foreground/5 border-foreground/10 hover:bg-foreground/10 relative flex flex-col gap-4 rounded-3xl border p-6 shadow-[0_18px_40px_-35px_rgba(15,23,42,0.6)] transition-all hover:shadow-[0_30px_60px_-45px_rgba(15,23,42,0.7)] md:pl-24"
					>
						<div
							class="bg-foreground/20 text-foreground/60 group-hover:text-foreground/80 absolute top-6 left-6 hidden size-12 items-center justify-center rounded-full text-base transition-all md:flex"
						>
							{pad(index + 2)}
						</div>
						<div class="flex flex-col gap-3">
							<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
								<div class="flex flex-wrap items-center gap-3">
									<h3 class="text-foreground text-xl font-semibold">{project.name}</h3>
									<span class="text-foreground/40 text-xs tracking-widest uppercase">
										{project.type}
									</span>
								</div>
								<div class="flex flex-wrap items-center gap-3">
									{#each project.languages as language}
										{@const Logo = getLanguageIcon(language)}
										<span
											class={cn(
												getLanguageColor(language),
												'flex flex-row items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium'
											)}
										>
											<Logo size={16} color="currentColor" />
											{language}
										</span>
									{/each}
								</div>
							</div>
							<p class="text-foreground/60 text-sm md:text-base">{project.description}</p>
						</div>
						<div class="text-foreground/50 flex items-center gap-2 text-sm">
							<span>Open project</span>
							<ArrowRight
								class="group-hover:text-foreground/60 size-4 transition-all group-hover:translate-x-1"
							/>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<div bind:this={footerLink} class="flex justify-center">
			<a
				class="group text-foreground/40 hover:text-foreground/80 flex items-center gap-2 text-center text-xs transition-all sm:text-sm"
				href="https://github.com/Konixy?tab=repositories"
				target="_blank"
				rel="noreferrer noopener"
			>
				View {repoCount - projects.length} more projects on my GitHub
				<ArrowRight class="hidden size-4 transition-all group-hover:translate-x-1 sm:block" />
			</a>
		</div>
	</div>
</div>
