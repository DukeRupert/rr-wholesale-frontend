<script lang="ts">
	import type { Address } from '@medusajs/medusa/dist/models/address';
	import { DELAY_MS, TIMEOUT_MS } from '$lib/constants';
	import { shippingAddressSchema } from '$lib/validators/account';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { fly, type FlyParams } from 'svelte/transition';
	import { quadOut, quadIn } from 'svelte/easing';
	import { AlertCircle } from 'lucide-svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Divider from '$lib/components/elements/Divider.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';
	import { createEventDispatcher } from 'svelte';

	export let data: SuperValidated<Infer<typeof shippingAddressSchema>>;
	export let shipping_addresses: Address[] = [];
	export let processing: boolean;
	
	let show_options = true;
	const dispatch = createEventDispatcher();

	const { form, errors, constraints, enhance } =
		superForm(data, {
			onSubmit({ cancel }) {
				if (processing) cancel(); // silly fast clickers
				processing = true; // start process
			},
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
				// Wrap things up
				processing = false; // end process
				dispatch('cancel') // close form
			},
			onError({ result }) {
				addToast({
					data: {
						type: 'error',
						title: 'Error',
						description: result.error.message
					}
				});
				processing = false; // end process
			},
			validators: zodClient(shippingAddressSchema),
			invalidateAll: true,
			taintedMessage: null,
			delayMs: DELAY_MS,
			timeoutMs: TIMEOUT_MS
		});


	// Animation settings
	const duration = 150;
	const flyIn: FlyParams = {
		x: 100,
		duration: duration,
		easing: quadOut
	};

	const flyOut: FlyParams = {
		x: -100,
		duration: duration,
		easing: quadIn
	};
</script>

{#if shipping_addresses.length > 0 && show_options}
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
							on:click|preventDefault={async () => {
								$form = address
								show_options = false;
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
	<Divider />
{/if}
<form
	in:fly={flyIn}
	out:fly={flyOut}
	id="addressForm"
	use:enhance
	action="?/updateShippingAddress"
	method="POST"
>
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
			on:click|preventDefault={() => dispatch('cancel')}
			type="button"
			class="btn btn-secondary">Cancel</button
		>
	</div>
</form>
