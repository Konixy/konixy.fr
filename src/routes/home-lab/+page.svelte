<script lang="ts">
import Home from '@tabler/icons-svelte/icons/home';
import Server from '@tabler/icons-svelte/icons/server';
import { gsap } from 'gsap';
import { onMount } from 'svelte';

type AppCategory = {
	label: string;
	description: string;
	apps: Array<{
		name: string;
		description: string;
		link?: string;
		status?: 'online' | 'maintenance' | 'offline';
	}>;
};

const categories: AppCategory[] = [
	{
		label: 'Media automation',
		description: 'Keeping the library updated without babysitting downloads.',
		apps: [
			{
				name: 'Radarr',
				description: 'Movie releases land automatically with the right quality.',
				link: 'https://radarr.video'
			},
			{
				name: 'Sonarr',
				description: 'New TV episodes appear as soon as they air.',
				link: 'https://sonarr.tv'
			},
			{
				name: 'Prowlarr',
				description: 'One place to handle indexers for Radarr and Sonarr.',
				link: 'https://prowlarr.com/'
			},
			{
				name: 'qBittorrent',
				description: 'Headless torrent client with automation and throttling.',
				link: 'https://www.qbittorrent.org/'
			},
			{
				name: 'Jellyfin',
				description: 'Media hub streaming to every screen in the house.',
				link: 'https://jellyfin.org/'
			},
			{
				name: 'Jellyseerr',
				description: 'Friends can request titles and they flow straight into Radarr/Sonarr.',
				link: 'https://seerr.dev/'
			}
		]
	},
	{
		label: 'Automations',
		description: 'Low-code flows glue everything together and flag issues.',
		apps: [
			{
				name: 'n8n',
				description: 'Workflows sync data, watch uptime, and send pings when needed.',
				link: 'https://n8n.io/'
			}
		]
	},
	{
		label: 'Home & personal tools',
		description: 'Daily-use services that keep the household organised and secure.',
		apps: [
			{
				name: 'Bitwarden',
				description: 'Password vault with shared collections and secrets sync.',
				link: 'https://bitwarden.com/'
			},
			{
				name: 'Home Assistant',
				description: 'Smart home dashboard and automations for sensors and lights.',
				link: 'https://www.home-assistant.io/'
			}
		]
	},
	{
		label: 'Infrastructure & observability',
		description: 'Reverse proxying and metrics keep everything online and measurable.',
		apps: [
			{
				name: 'Nginx Proxy Manager',
				description: 'Simple UI for SSL, routing, and certificates.',
				link: 'https://nginxproxymanager.com/'
			},
			{
				name: 'Prometheus',
				description: 'Time-series metrics powering alerts.',
				link: 'https://prometheus.io/'
			},
			{
				name: 'Grafana',
				description: 'Dashboards for metrics, logs, and uptime.',
				link: 'https://grafana.com/'
			}
		]
	}
];

let heroSection: HTMLDivElement | null = $state(null);
let categoriesWrapper: HTMLDivElement | null = $state(null);

onMount(() => {
	const ctx = gsap.context(() => {
		if (heroSection) {
			gsap.from(heroSection.children, {
				y: 30,
				opacity: 0,
				duration: 1,
				stagger: 0.12,
				ease: 'power3.out'
			});
		}

		if (categoriesWrapper) {
			gsap.utils
				.toArray<HTMLElement>(categoriesWrapper.querySelectorAll('[data-animate="category"]'))
				.forEach((category, index) => {
					gsap.from(category, {
						opacity: 0,
						y: 40,
						duration: 1,
						delay: index * 0.1,
						ease: 'power3.out'
					});
				});
		}
	}, heroSection ?? undefined);

	return () => ctx.revert();
});
</script>

<section class="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-32 pb-20">
	<div bind:this={heroSection} class="flex flex-col items-center gap-4 text-center">
		<a
			class="text-foreground/50 hover:text-foreground/80 flex flex-row items-center gap-2 transition-colors"
			href="/"
		>
			<Home class="size-4" />
			Return home
		</a>
		<h1 class="text-foreground text-4xl font-bold sm:text-5xl">Homelab services</h1>
		<p class="text-foreground/60 max-w-xl text-sm sm:text-base">
			The essentials that keep media, automations, and observability running smoothly.
		</p>
	</div>

	<div bind:this={categoriesWrapper} class="flex flex-col gap-14">
		{#each categories as category}
			<section data-animate="category" class="flex flex-col gap-5">
				<header class="flex flex-col gap-2">
					<span class="text-foreground/40 text-xs tracking-[0.3em] uppercase">{category.label}</span
					>
					<p class="text-foreground/50 text-sm sm:text-base">{category.description}</p>
				</header>
				<ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each category.apps as app (app.name)}
						<li
							class="border-foreground/10 bg-background/40 hover:border-foreground/30 flex flex-col gap-2 rounded-2xl border p-5 transition-colors"
						>
							<div class="flex items-start justify-between gap-6">
								<h3 class="text-foreground text-lg font-medium">{app.name}</h3>
								{#if app.link}
									<a
										href={app.link}
										target="_blank"
										rel="noreferrer noopener"
										class="text-foreground/40 text-xs tracking-[0.25em] uppercase"
									>
										Visit
									</a>
								{/if}
							</div>
							<p class="text-foreground/50 text-sm">{app.description}</p>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>

	<footer
		class="border-foreground/10 bg-background/60 flex flex-col gap-3 rounded-2xl border p-5 text-center"
	>
		<h2 class="text-foreground text-xl font-semibold">Stack notes</h2>
		<p class="text-foreground/60 text-sm">
			Running on Arch Linux with Docker Compose, nightly backups, and proxy rules managed through
			Nginx Proxy Manager.
		</p>
	</footer>
</section>
