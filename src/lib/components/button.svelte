<script lang="ts">
import { cn } from '$lib/utils';
import type { HTMLAttributes } from 'svelte/elements';

let {
	children,
	...props
}: { children?: any; href?: string } & HTMLAttributes<HTMLButtonElement> &
	HTMLAttributes<HTMLAnchorElement> = $props();

let className = cn(
	'border-foreground/10 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-px bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-center text-base font-normal transition-all',
	props.class
);
</script>

{#if props.href}
	<a href={props.href} {...props} class={className}>
		{@render children?.()}
	</a>
{:else}
	<button {...props} class={className}>
		{@render children?.()}
	</button>
{/if}
