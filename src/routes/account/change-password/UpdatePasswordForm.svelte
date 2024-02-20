<script lang="ts">
	import { updatePasswordSchema } from '$lib/validators/account';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { AlertCircle } from 'lucide-svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';

	export let data: SuperValidated<Infer<typeof updatePasswordSchema>>;
	export let rurl: string = '';

	const { form, errors, delayed, enhance } = superForm(
		data,
		{
			onUpdated({ form }) {
				if (form.message) {
					addToast({
						data: {
							type: form.message.type,
							title: form.message.type,
							description: form.message.text
						}
					});
				}
			},
			onError({ result }) {
				addToast({
					data: {
						type: 'error',
						title: 'Error',
						description: result.error.message
					}
				});
			},
			resetForm: false,
			validators: zodClient(updatePasswordSchema),
			invalidateAll: true,
			taintedMessage: null
		}
	);

	$form.rurl = rurl;
</script>

<form use:enhance method="POST" class="space-y-6">
	<input type="hidden" name="rurl" value={$form.rurl} />
	<div>
		<label for="newPassword" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
			>Email address</label
		>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="newPassword"
				name="newPassword"
				type="password"
				required
				class="block w-full input"
				aria-invalid={$form.newPassword ? 'true' : undefined}
				aria-describedby={$errors.newPassword ? 'newPassword-error' : undefined}
				bind:value={$form.newPassword}
			/>
			{#if $errors.newPassword}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.newPassword}
			<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.newPassword}</p>
		{/if}
	</div>

	<div>
		<div class="flex items-center justify-between">
			<label
				for="confirmPassword"
				class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Password</label
			>
		</div>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				required
				class="block w-full input"
				aria-invalid={$form.confirmPassword ? 'true' : undefined}
				aria-describedby={$errors.confirmPassword ? 'email-error' : undefined}
				bind:value={$form.confirmPassword}
			/>
			{#if $errors.confirmPassword}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.confirmPassword}
			<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.confirmPassword}</p>
		{/if}
	</div>
	<div>
		<button type="submit" class="flex w-full btn"
			>{#if $delayed}<Spinner /> &nbsp; Sign in{:else}Sign in
			{/if}</button
		>
	</div>
</form>
