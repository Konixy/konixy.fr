<script lang="ts">
import Title from '$lib/components/title.svelte';
import FloatingLogos from '$lib/components/floating-logos.svelte';
</script>

<div class="flex h-screen flex-col items-center justify-center gap-10">
	<!-- <FloatingLogos> -->
	<div class="pointer-events-none relative h-16 w-16 overflow-hidden rounded-full">
		<img src="/moi.jpeg" alt="Anatole Dufour" class="absolute inset-0 h-full w-full object-cover" />
	</div>
	<Title />
	<!-- </FloatingLogos> -->
	<div class="motion flex flex-row items-center gap-2">
		<p class="text-foreground/60 text-center text-xl">18'</p>
		⸱
		<p class="text-foreground/60 text-center text-xl">Fullstack developer</p>
		⸱
		<p class="text-foreground/60 text-center text-xl">France 🇫🇷</p>
	</div>
</div>
