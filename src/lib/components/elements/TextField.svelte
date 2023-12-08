<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { AlertCircle } from 'lucide-svelte';

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label for={field} class="label">{field}</label>
<div class="relative mt-2">
	<input
		id={field}
		name={field}
		type="text"
		aria-invalid={$errors ? 'true' : undefined}
		class="block w-full input"
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
	{#if $errors}
		<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
			<AlertCircle class="h-5 w-5 text-red-500" />
		</div>{/if}
</div>
{#if $errors}<span class="mt-2 text-sm text-red-600" id={`${field}-error`}>{$errors}</span>{/if}
