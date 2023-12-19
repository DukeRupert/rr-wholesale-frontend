<script lang="ts">
	import { contactSalesSchema } from '$lib/validators/auth';
	import type { ContactSalesSchema } from '$lib/validators/auth';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { AlertCircle } from 'lucide-svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';
	import { createEventDispatcher } from 'svelte';

	export let data: SuperValidated<ContactSalesSchema>;

	const dispatch = createEventDispatcher<{ success: { f: string; l: string } }>();

	const { form, errors, tainted, message, submitting, delayed, timeout, enhance } = superForm(
		data,
		{
			onUpdated({ form }) {
				if (form.message) {
					if ($page.status === 401)
						// Display the message using a toast library
						addToast({
							data: {
								type: 'warning',
								title: 'Warning',
								description: form.message
							}
						});
				} else {
					// handle success
					addToast({
						data: {
							type: 'success',
							title: 'Success',
							description: "You've been logged in!"
						}
					});
					dispatch('success', { f: $form.first_name, l: $form.last_name });
				}
			},
			onError({ result }) {
				console.log(result);
				// Display the message using a toast library
				addToast({
					data: {
						type: 'error',
						title: 'Error',
						description: result.error.message
					}
				});
			},
			resetForm: false,
			validators: contactSalesSchema,
			invalidateAll: true,
			taintedMessage: null,
			delayMs: 200,
			timeoutMs: 8000
		}
	);
</script>

<form use:enhance method="POST" class="space-y-6">
	<input type="text" name="password" class="hidden" value="" />
	<div>
		<label for="first_name" class="label">First</label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="first_name"
				name="first_name"
				type="text"
				autocomplete="email"
				required
				class="block w-full input"
				aria-invalid={$form.first_name ? 'true' : undefined}
				aria-describedby={$errors.first_name ? 'first_name-error' : undefined}
				bind:value={$form.first_name}
			/>
			{#if $errors.first_name}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.first_name}
			<p class="mt-2 text-sm text-red-600" id="first_name-error">{$errors.first_name}</p>
		{/if}
	</div>
	<div>
		<label for="last_name" class="label">Last</label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="last_name"
				name="last_name"
				type="text"
				autocomplete="email"
				required
				class="block w-full input"
				aria-invalid={$form.last_name ? 'true' : undefined}
				aria-describedby={$errors.last_name ? 'last_name-error' : undefined}
				bind:value={$form.last_name}
			/>
			{#if $errors.last_name}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.last_name}
			<p class="mt-2 text-sm text-red-600" id="last_name-error">{$errors.last_name}</p>
		{/if}
	</div>
	<div>
		<label for="email" class="label">Email address</label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				required
				class="block w-full input"
				aria-invalid={$form.email ? 'true' : undefined}
				aria-describedby={$errors.email ? 'email-error' : undefined}
				bind:value={$form.email}
			/>
			{#if $errors.email}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.email}
			<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.email}</p>
		{/if}
	</div>

	<div>
		<label for="message" class="label">Message</label>

		<div class="mt-2">
			<textarea
				id="message"
				rows="3"
				name="message"
				autocomplete="current-message"
				required
				class="block w-full input"
				aria-invalid={$form.message ? 'true' : undefined}
				aria-describedby={$errors.message ? 'email-error' : undefined}
				bind:value={$form.message}
			/>
			{#if $errors.message}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.message}
			<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.message}</p>
		{/if}
		<p class="mt-3 text-sm leading-6 text-gray-600">Please tell us a little about your business.</p>
	</div>
	<div>
		<button type="submit" class="flex w-full btn"
			>{#if $delayed}<Spinner /> &nbsp; Send{:else}
				Send
			{/if}</button
		>
	</div>
</form>
