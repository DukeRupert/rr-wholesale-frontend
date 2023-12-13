<script lang="ts">
	import { updateUserSchema } from '$lib/validators/account';
	import type { UpdateUserSchema } from '$lib/validators/account';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { AlertCircle } from 'lucide-svelte';
	import { fly, type FlyParams } from 'svelte/transition';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';
	import { quadOut } from 'svelte/easing';

	export let data: SuperValidated<UpdateUserSchema>;
	export let processing: boolean;
	// Form configuration
	export let delayMs = 200;
	export let timeoutMs = 8000;
	export let flyInParams: FlyParams = {
		x: -50,
		duration: 250,
		delay: 100,
		easing: quadOut
	};

	const { form, errors, constraints, delayed, enhance } = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				if ($page.status === 200)
					// Display the message using a toast library
					addToast({
						data: {
							type: 'success',
							title: 'Success',
							description: 'Success! Check your email for a confirmation link.'
						}
					});
				if ($page.status === 401)
					// Display the message using a toast library
					addToast({
						data: {
							type: 'warning',
							title: 'Warning',
							description: form.message
						}
					});
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
		validators: updateUserSchema,
		invalidateAll: true,
		taintedMessage: null,
		delayMs: delayMs,
		timeoutMs: timeoutMs
	});
</script>

<form in:fly={flyInParams} action="?/editUserInfo" method="POST" use:enhance>
	<div class="mt-5 mb-8 max-w-lg grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
		<div class="sm:col-span-6">
			<label for="first_name" class="label">First Name</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="first_name"
					required
					class="block w-full input"
					aria-invalid={$errors.first_name ? 'true' : undefined}
					bind:value={$form.first_name}
					{...$constraints.first_name}
				/>
				{#if $errors.first_name}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
			{#if $errors.first_name}
				<p class="mt-2 text-sm text-red-600" id="email-error">
					{$errors.first_name}
				</p>
			{/if}
		</div>
		<div class="sm:col-span-6">
			<label for="last_name" class="label">Last Name</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="last_name"
					required
					class="block w-full input"
					aria-invalid={$errors.last_name ? 'true' : undefined}
					bind:value={$form.last_name}
					{...$constraints.last_name}
				/>
				{#if $errors.last_name}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
			{#if $errors.last_name}
				<p class="mt-2 text-sm text-red-600" id="email-error">
					{$errors.last_name}
				</p>
			{/if}
		</div>
		<div class="sm:col-span-7">
			<label for="email" class="label">Email</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="email"
					class="block w-full input"
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$form.email}
					{...$constraints.email}
				/>
				{#if $errors.email}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
			{#if $errors.email}
				<p class="mt-2 text-sm text-red-600" id="email-error">
					{$errors.email}
				</p>
			{/if}
		</div>

		<div class="sm:col-span-5">
			<label for="last_name" class="label">Phone (optional)</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="phone"
					class="block w-full input"
					aria-invalid={$errors.phone ? 'true' : undefined}
					bind:value={$form.phone}
					{...$constraints.phone}
				/>
				{#if $errors.phone}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
			{#if $errors.phone}
				<p class="mt-2 text-sm text-red-600" id="email-error">
					{$errors.phone}
				</p>
			{/if}
		</div>
		<div class="sm:col-span-6">
			<button type="submit" disabled={processing} class="mt-6 flex w-full btn">
				{#if processing && $delayed}
					<Spinner /> &nbsp; Processing...
				{:else}
					Save
				{/if}
			</button>
		</div>
	</div>
</form>
