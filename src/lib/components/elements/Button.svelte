<script lang="ts">
	type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export let text = 'Button text';
	export let size: ButtonSize = 'md';
	export let action = () => console.log('Button clicked');
</script>

{#if size === 'xs'}
	<button
		type="button"
		class="rounded bg-black px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
		>{text}</button
	>
{:else if size === 'sm'}
	<button
		type="button"
		class="rounded bg-black px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
		>{text}</button
	>
{:else if size === 'md'}
	<button
		type="button"
		class="rounded-md bg-black px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
		>{text}</button
	>
{:else if size === 'lg'}
	<button
		type="button"
		class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
		>{text}</button
	>
{:else if size === 'xl'}
	<button
		type="button"
		class="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
		>{text}</button
	>
{:else}
	<button
		type="button"
		class="rounded-md bg-black px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
		>{text}</button
	>
{/if}
