<script lang="ts">
	import { registerSchema } from '$lib/validators/auth';
	import type { RegisterSchema } from '$lib/validators/auth';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { AlertCircle } from 'lucide-svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';

	export let data: SuperValidated<RegisterSchema>;
	export let rurl: string = '';

	const { form, errors, tainted, message, submitting, delayed, timeout, enhance } = superForm(
		data,
		{
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
			validators: registerSchema,
			invalidateAll: true,
			taintedMessage: null,
			delayMs: 200,
			timeoutMs: 8000
		}
	);

	$form.rurl = rurl;
</script>

<form
	use:enhance
	action="?/login"
	method="POST"
	class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12"
>
	<input type="hidden" name="rurl" value={$form.rurl} />
	<div class="sm:col-span-6">
		<label for="first_name" class="label">First name</label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="first_name"
				name="first_name"
				type="text"
				autocomplete="given-name"
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

	<div class="sm:col-span-6">
		<label for="last_name" class="label">Last name</label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<input
				id="last_name"
				name="last_name"
				type="text"
				autocomplete="given-name"
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

	<div class="sm:col-span-12">
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

	<div class="sm:col-span-12">
		<label for="password" class="label">Password</label>

		<div class="mt-2">
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
				class="block w-full input"
				aria-invalid={$form.password ? 'true' : undefined}
				aria-describedby={$errors.password ? 'password-error' : undefined}
				bind:value={$form.password}
			/>
			{#if $errors.password}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.password}
			<p class="mt-2 text-sm text-red-600" id="password-error">{$errors.password}</p>
		{/if}
	</div>
	<div class="sm:col-span-12">
		<label for="passwordConfirm" class="label">Confirm password</label>

		<div class="mt-2">
			<input
				id="passwordConfirm"
				name="passwordConfirm"
				type="password"
				autocomplete="current-password"
				required
				class="block w-full input"
				aria-invalid={$form.passwordConfirm ? 'true' : undefined}
				aria-describedby={$errors.passwordConfirm ? 'passwordConfirm-error' : undefined}
				bind:value={$form.passwordConfirm}
			/>
			{#if $errors.passwordConfirm}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-red-500" />
				</div>
			{/if}
		</div>
		{#if $errors.passwordConfirm}
			<p class="mt-2 text-sm text-red-600" id="passwordConfirm-error">{$errors.passwordConfirm}</p>
		{/if}
	</div>
	<div class="sm:col-span-12">
		<button type="submit" class="flex w-full btn"
			>{#if $delayed}<Spinner /> &nbsp; Register{:else}Register
			{/if}</button
		>
	</div>
</form>
