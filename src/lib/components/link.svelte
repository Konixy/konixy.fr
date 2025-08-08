<script lang="ts">
import { cn } from '$lib/utils';

let {
	href,
	children,
	class: className
}: { href: string; children?: any; class?: string } = $props();
</script>

<a
	{href}
	target="_blank"
	class={cn(
		'bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl p-2 text-center text-xl transition-all',
		className
	)}
>
	{@render children?.()}
</a>
