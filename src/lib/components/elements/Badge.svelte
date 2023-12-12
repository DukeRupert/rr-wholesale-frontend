<script lang="ts">
	export let type = '';
	export let status = 'default';
</script>

{#if type === 'fulfilled'}
	<span
		class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
		>{status}</span
	>
{:else}
	<span
		class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
		>{status}</span
	>
{/if}
