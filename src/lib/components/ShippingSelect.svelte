<script lang="ts">
	import type { ShippingOption } from '$lib/types/cart';
	import { formatPrice } from '$lib/utilities';
	import { createRadioGroup, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';

	export let data: ShippingOption[];

	// https://www.melt-ui.com/docs/builders/radio-group
	const {
		elements: { root, item, hiddenInput },
		helpers: { isChecked }
	} = createRadioGroup({});

	const dispatch = createEventDispatcher();

	function handleClick(e) {
		dispatch('select', { id: e.target.id });
	}
</script>

<fieldset class="mt-4">
	<legend class="sr-only">Shipping Methods</legend>
	<div use:melt={$root} class="space-y-4" aria-label="shipping methods">
		{#each data as option}
			<div class="flex items-center px-2 py-4 rounded-lg bg-white dark:bg-gray-800 shadow">
				<button
					use:melt={$item(option.id)}
					on:m-click={handleClick}
					on:m-keydown={handleClick}
					class="h-4 w-4 border-gray-300 border-2 rounded-full text-indigo-600 ring-indigo-600 focus:ring-2 focus:ring-space-2"
					id={option.id}
					aria-labelledby="{option}-label"
				>
					{#if $isChecked(option.id)}
						<div class="h-3 w-3 rounded-full bg-indigo-600" />
					{/if}
				</button>
				<label
					class="ml-3 block text-sm font-medium leading-6 text-gray-900"
					for={option.id}
					id="{option.id}-label"
				>
					{option.name} - {formatPrice(option.amount)}
				</label>
			</div>
		{/each}
		<input name="line-height" use:melt={$hiddenInput} />
	</div>
</fieldset>
