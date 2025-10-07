<script lang="ts">
import Aurora from '$lib/components/aurora.svelte';
import '../app.css';

let { children } = $props();
</script>

<Aurora />

{@render children?.()}
