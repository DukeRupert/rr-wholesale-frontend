<script lang="ts">
	import { DELAY_MS, TIMEOUT_MS } from '$lib/constants';
	import { shippingAddressSchema, type ShippingAddressSchema } from '$lib/validators/account';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { AlertCircle } from 'lucide-svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Divider from '$lib/components/elements/Divider.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';
	import type { ShippingAddress } from '$lib/types/user';
	import { createEventDispatcher } from 'svelte';

	export let data: SuperValidated<ShippingAddressSchema>;
	export let shipping_addresses: ShippingAddress[] = [];
	export let processing: boolean;
	export let isUpdatingAddress: boolean;

	const dispatch = createEventDispatcher();

	const { form, errors, constraints, tainted, message, submitting, delayed, timeout, enhance } =
		superForm(data, {
			onSubmit({ cancel }) {
				if (processing) cancel(); // silly fast clickers
				processing = true; // start process
			},
			onUpdated({ form }) {
				if (form.message) {
					// Something went wrong
					if ($page.status === 400)
						addToast({
							data: {
								type: 'warning',
								title: 'Warning',
								description: form.message
							}
						});
					if ($page.status === 500)
						addToast({
							data: {
								type: 'error',
								title: 'Error',
								description: form.message
							}
						});
				} else {
					// Send message to update shipping method options
					dispatch('addressUpdated');
					// Success
					addToast({
						data: {
							type: 'success',
							title: 'Success',
							description: 'Contact information updated.'
						}
					});
				}
				// Wrap things up
				processing = false; // end process
				isUpdatingAddress = false; // close form
			},
			onError({ result }) {
				addToast({
					data: {
						type: 'error',
						title: 'Error',
						description: result.error.message
					}
				});
				// Wrap things up
				processing = false; // end process
			},
			validators: shippingAddressSchema,
			invalidateAll: true,
			taintedMessage: null,
			delayMs: DELAY_MS,
			timeoutMs: TIMEOUT_MS
		});

	let showOptions = true;
</script>

{#if shipping_addresses.length > 0 && showOptions}
	<ul role="list" class="mt-3 mb-8 sm:mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each shipping_addresses as address, i (address.id)}
			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 dark:divide-gray-900 rounded-lg bg-white dark:bg-gray-800 shadow"
			>
				<div class="grow flex flex-col w-full justify-between p-6">
					<div>
						<p class="block text-sm font-medium text-gray-900 dark:text-gray-100">
							{address.first_name}
							{address.last_name}
						</p>
						{#if address.company}
							<p class="block text-sm font-medium text-gray-900 dark:text-gray-100">
								{address.company}
							</p>
						{/if}
						<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
							{address.address_1}
						</p>
						{#if address.address_2}
							<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
								{address.address_2}
							</p>
						{/if}
						<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
							{address.city}, {address.province}
							{address.postal_code}
						</p>
						{#if address.phone}
							<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
								{address.phone}
							</p>
						{/if}
					</div>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200 dark:divide-gray-900">
						<button
							type="submit"
							on:click|preventDefault={() => {
								$form = address;
								showOptions = false;
							}}
							class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-thunderbird-600 dark:hover:text-thunderbird-500 capitalize"
						>
							select
						</button>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
<Divider />
<form id="addressForm" use:enhance action="?/updateShippingAddress" method="POST">
	<div class="mt-8 sm:mt-12 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
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
		<div class="sm:col-span-4">
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
	</div>
	<div class="mt-10 flex justify-end space-x-6 border-t border-gray-200 pt-6">
		<button type="submit" class="btn"
			>{#if processing}<Spinner />{:else}Confirm{/if}</button
		>
		<button
			on:click|preventDefault={() => (isUpdatingAddress = false)}
			type="button"
			class="btn btn-secondary">Cancel</button
		>
	</div>
</form>
