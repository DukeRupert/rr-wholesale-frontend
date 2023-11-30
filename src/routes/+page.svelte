<script>
	import { createCollapsible, melt } from '@melt-ui/svelte';
	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible();
</script>

<div class="prose prose-slate px-4 py-2">
	<h1 class="text-3xl font-bold text-firebird-500">Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<div use:melt={$root}>
		<button use:melt={$trigger}>{$open ? 'Close' : 'Open'}</button>
		<div use:melt={$content}>Obi-Wan says: Hello there!</div>
	</div>
</div>
