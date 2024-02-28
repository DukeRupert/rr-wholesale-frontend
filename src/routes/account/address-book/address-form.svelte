<script lang="ts">
	import { addToast } from '$lib/components/toast/index.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { shippingAddressSchema } from '$lib/validators/account';
	import { createEventDispatcher } from 'svelte';
	import { AlertCircle } from 'lucide-svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';

	export let data: SuperValidated<Infer<typeof shippingAddressSchema>>;
	let processing: boolean = false;

	const dispatch = createEventDispatcher();

	const { form, errors, constraints, delayed, enhance } = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				const type = form.message.type;
				addToast({
					data: {
						type: form.message.type,
						title: form.message.type,
						description: form.message.text
					}
				});
			}
			dispatch('cancel')
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
		validators: zodClient(shippingAddressSchema),
		invalidateAll: true,
		taintedMessage: null
	});
</script>

<form action="?/addAddress" method="POST" use:enhance>
	<div class="max-w-lg mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
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
		</div>
		<div class="sm:col-span-12">
			<label for="company" class="label">Company</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="company"
					class="block w-full input"
					aria-invalid={$errors.company ? 'true' : undefined}
					bind:value={$form.company}
					{...$constraints.company}
				/>
				{#if $errors.company}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
		<div class="sm:col-span-12">
			<label for="address_1" class="label">Address Line 1</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="address_1"
					required
					class="block w-full input"
					aria-invalid={$errors.address_1 ? 'true' : undefined}
					bind:value={$form.address_1}
					{...$constraints.address_1}
				/>
				{#if $errors.address_1}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
		<div class="sm:col-span-12">
			<label for="address_2" class="label">Address Line 2</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="address_2"
					class="block w-full input"
					aria-invalid={$errors.address_2 ? 'true' : undefined}
					bind:value={$form.address_2}
					{...$constraints.address_2}
				/>
				{#if $errors.address_2}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
		<div class="sm:col-span-8">
			<label for="city" class="label">City</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="city"
					required
					class="block w-full input"
					aria-invalid={$errors.city ? 'true' : undefined}
					bind:value={$form.city}
					{...$constraints.city}
				/>
				{#if $errors.city}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
		<div class="sm:col-span-4">
			<label for="province" class="label">State</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="province"
					required
					class="block w-full input"
					aria-invalid={$errors.province ? 'true' : undefined}
					bind:value={$form.province}
					{...$constraints.province}
				/>
				{#if $errors.province}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
		<div class="sm:col-span-4">
			<label for="postal_code" class="label">Postal Code</label>
			<div class="relative mt-2">
				<input
					type="text"
					name="postal_code"
					required
					class="block w-full input"
					aria-invalid={$errors.postal_code ? 'true' : undefined}
					bind:value={$form.postal_code}
					{...$constraints.postal_code}
				/>
				{#if $errors.postal_code}
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<AlertCircle class="h-5 w-5 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
		<div class="sm:col-span-8">
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
	</div>
</form>
