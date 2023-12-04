<!--
 @component
 A control that allows the user to toggle between checked and not checked.
 #### Props
 - **name**: string - The name of the checkbox. Submitted with its owning form as part of a name/value pair. Defaults to 'checkbox'.
 - **label**: string - The label of the checkbox.
 - **description**: string - The description of the checkbox.
 - **defaultChecked**: boolean | 'indeterminate' - The initial state of the checkbox. Defaults to false.
 - **disabled**: boolean - Whether the checkbox is disabled. Defaults to false.
 - **required**: boolean - Whether the checkbox is required. Defaults to false.
-->
<script lang="ts">
	import { createCheckbox, melt } from '@melt-ui/svelte';
	import { Check, Minus } from 'lucide-svelte';

	export let name: string = 'checkbox';
	export let label: string = '';
	export let description: string = '';
	export let defaultChecked: boolean | 'indeterminate' = false;
	export let disabled: boolean = false;
	export let required: boolean = false;

	// https://www.melt-ui.com/docs/builders/checkbox
	const {
		elements: { root, input },
		helpers: { isChecked, isIndeterminate }
	} = createCheckbox({
		defaultChecked: defaultChecked,
		disabled: disabled,
		required: required,
		name: name
	});
</script>

<button
	use:melt={$root}
	class="flex items-center justify-center rounded h-5 w-5 border-gray-300 border-2 text-indigo-600 focus:ring-indigo-600 hover:opacity-75"
	id={name}
>
	{#if $isIndeterminate}
		<Minus class="h-5 w-5" />
	{:else if $isChecked}
		<Check class="h-5 w-5" />
	{:else}
		<Check class="invisible h-5 w-5" />
	{/if}
	<input use:melt={$input} value={$isIndeterminate ? 'indeterminate' : $isChecked} />
</button>
<div class="ml-3 text-sm leading-6">
	<label for={name} class="font-medium text-gray-900">{label}</label>
	<p id={`${name}-description`} class="text-gray-500">{description}</p>
</div>
