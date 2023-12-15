<script lang="ts">
	import type { ToastEvent } from '$lib/types/events';
	import type { UpdatePasswordSchema } from '$lib/validators/account';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { updatePasswordSchema } from '$lib/validators/account';
	import { superForm } from 'sveltekit-superforms/client';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import { quadOut } from 'svelte/easing';
	import { fly, type FlyParams } from 'svelte/transition';
	import { AlertCircle } from 'lucide-svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';

	const dispatch = createEventDispatcher<ToastEvent>();
	const simpleDispatch = createEventDispatcher();

	export let data: SuperValidated<UpdatePasswordSchema>;
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
				if ($page.status === 400)
					dispatch('toast', {
						type: 'warning',
						title: 'Warning',
						description: form.message
					});
			} else {
				dispatch('toast', {
					type: 'success',
					title: 'Success',
					description: 'Success! Your account information has been updated.'
				});
				simpleDispatch("cancel")
			}
		},
		onError({ result }) {
			console.log(result);
			dispatch('toast', {
				type: 'error',
				title: 'Error',
				description: result.error.message
			});
		},
		validators: updatePasswordSchema,
		invalidateAll: true,
		taintedMessage: null,
		delayMs: delayMs,
		timeoutMs: timeoutMs
	});
</script>

<form in:fly={flyInParams} action="?/updatePassword" method="POST" use:enhance>
	<div class="max-w-lg mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
		<div class="sm:col-span-6">
			<label for="newPassword" class="label">New Password</label>
			<div class="relative mt-2">
				<input
					name="newPassword"
					type="password"
					autocomplete="new-password"
					required
					class="block w-full input"
					aria-invalid={$errors.newPassword ? 'true' : undefined}
					bind:value={$form.newPassword}
					{...$constraints.newPassword}
				/>
				{#if $errors.newPassword}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
			{#if $errors.newPassword}
				<p class="mt-2 text-sm text-red-600" id="email-error">
					{$errors.newPassword}
				</p>
			{/if}
		</div>
		<div class="sm:col-span-6">
			<label for="confirmPassword" class="label">Confirm New Password</label>
			<div class="relative mt-2">
				<input
					name="confirmPassword"
					type="password"
					autocomplete="new-password"
					required
					class="block w-full input"
					aria-invalid={$errors.confirmPassword ? 'true' : undefined}
					bind:value={$form.confirmPassword}
					{...$constraints.confirmPassword}
				/>
				{#if $errors.confirmPassword}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
			{#if $errors.confirmPassword}
				<p class="mt-2 text-sm text-red-600" id="email-error">
					{$errors.confirmPassword}
				</p>
			{/if}
		</div>
		<div class="sm:col-span-6">
			<button disabled={processing} type="submit" class="mt-6 flex w-full btn">
				{#if processing && $delayed}
					<Spinner /> &nbsp; Processing...
				{:else}
					Save
				{/if}
			</button>
		</div>
		<div class="sm:col-span-6">
			<button
				hidden={processing}
				on:click|preventDefault={() => {
					simpleDispatch("cancel")	
				}}
				type="button"
				class="mt-6 w-full btn btn-secondary"
			>
				Cancel
			</button>
		</div>
	</div>
</form>
