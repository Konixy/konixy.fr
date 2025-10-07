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
		'[&_path]:fill-foreground/50 hover:[&_path]:fill-foreground text-center transition-all [&_path]:transition-all',
		className
	)}
>
	{@render children?.()}
</a>
