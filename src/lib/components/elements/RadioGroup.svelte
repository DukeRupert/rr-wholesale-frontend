<!--
 @component
 A set of checkable buttons — known as radio buttons — where no more than one of the buttons can be checked at a time.
 #### Props
 - **label**: string - The label of the fieldset.
 - **description**: string - The description of the fieldset.
 - **options**: string[] - The options of the radio group.
-->

<script lang="ts">
	import { createRadioGroup, melt } from '@melt-ui/svelte';

	export let label: string = 'Label';
	export let description: string = '';
	export let options: string[] = ['default', 'comfortable', 'compact'];

	// https://www.melt-ui.com/docs/builders/radio-group
	const {
		elements: { root, item, hiddenInput },
		helpers: { isChecked }
	} = createRadioGroup({
		defaultValue: 'default'
	});
</script>

<div>
	<label class="text-base font-semibold text-gray-900">{label}</label>
	<p class="text-sm text-gray-500">{description}</p>
	<fieldset class="mt-4">
		<legend class="sr-only">{label}</legend>
		<div use:melt={$root} class="space-y-4" aria-label={label}>
			{#each options as option}
				<div class="flex items-center">
					<button
						use:melt={$item(option)}
						class="h-4 w-4 border-gray-300 border-2 rounded-full text-indigo-600 ring-indigo-600 focus:ring-2 focus:ring-space-2"
						id={option}
						aria-labelledby="{option}-label"
					>
						{#if $isChecked(option)}
							<div class="h-3 w-3 rounded-full bg-indigo-600" />
						{/if}
					</button>
					<label
						class="ml-3 block text-sm font-medium leading-6 text-gray-900"
						for={option}
						id="{option}-label"
					>
						{option}
					</label>
				</div>
			{/each}
			<input name="line-height" use:melt={$hiddenInput} />
		</div>
	</fieldset>
</div>
