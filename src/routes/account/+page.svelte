<script lang="ts">
	import type { PageData } from './$types';
	import type { ToastEventPayload } from '$lib/types/events';
	import type { FlipParams } from 'svelte/animate';
	import type { FlyParams } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { addToast } from '$lib/components/toast/index.svelte';
	import UpdateCustomerForm from './UpdateCustomerForm.svelte';
	import UpdatePasswordForm from './UpdatePasswordForm.svelte';
	import AddressBook from './AddressBook.svelte';
	import AddAddressForm from './AddAddressForm.svelte';

	export let data: PageData;
	$: ({ update_customer_form, update_password_form, update_address_form } = data);
	$: ({ email, first_name, last_name, phone, shipping_addresses } = data.user);

	// Toggles
	let processing = false;
	let showUpdateCustomer = false;
	let showAddAddress = false;
	let showUpdatePassword = false;

	// Form configuration
	const delayMs = 200;
	const timeoutMs = 8000;
	
	// Animation 
	const flipParams: FlipParams = {
		duration: 250,
		easing: quadOut
	};
	const flyInParams: FlyParams = {
		x: -50,
		duration: 250,
		delay: 100,
		easing: quadOut
	};

	// Toast Messages
	function handleToast(e: CustomEvent<ToastEventPayload>) {
		const details = e.detail;
		addToast({
			data: {
				...details
			}
		});
	}
</script>

<div class="max-w-xl">
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Account Information</h1>
	<p class="mt-1 text-sm text-gray-500">
		Update your personal information, address book and account
	</p>
</div>

<div class="mx-auto">
	<!-- Contact Information -->
	<div class="border-b border-gray-200 dark:border-gray-600 px-4 py-5 sm:px-6">
		<div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
			<div class="ml-4 mt-2">
				<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
					Contact Information
				</h3>
			</div>
			<div class="ml-4 mt-2 flex-shrink-0">
				<button
					type="button"
					on:click={() => (showUpdateCustomer = !showUpdateCustomer)}
					class="relative inline-flex btn px-3 py-2 text-sm font-semibold"
					>{showUpdateCustomer ? 'Cancel' : 'Edit'}
				</button>
			</div>
		</div>
	</div>
	{#if showUpdateCustomer}
		<UpdateCustomerForm
			data={update_customer_form}
			{delayMs}
			{timeoutMs}
			{flyInParams}
			bind:processing
			on:toast={handleToast}
			on:cancel={() => showUpdateCustomer = false}
		/>
	{:else if showUpdatePassword}
		<UpdatePasswordForm
			data={update_password_form}
			{delayMs}
			{timeoutMs}
			{flyInParams}
			bind:processing
			on:toast={handleToast}
			on:cancel={() => (showUpdatePassword = false)}
		/>
	{:else}
		<div class="p-6">
			<h3 class="mt-3 text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
			{first_name}
			{last_name}
		</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400">{email}</p>
		{#if phone}
			<p>{phone}</p>
		{/if}
		<button
			on:click={() => {
				showUpdatePassword = true;
			}}
			class="text-thunderbird-600 hover:text-thunderbird-500 mt-3">Change Password</button
		>
		</div>
	{/if}

	<!-- Addresses -->
	<div
		class="border-b border-gray-200 dark:border-gray-600 px-4 py-5 sm:px-6 mt-8 sm:mt-12 lg:mt-20"
	>
		<div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
			<div class="ml-4 mt-2">
				<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
					Address Information
				</h3>
			</div>
			<div class="ml-4 mt-2 flex-shrink-0">
				<button
					type="button"
					on:click={() => (showAddAddress = !showAddAddress)}
					class="relative inline-flex btn px-3 py-2 text-sm font-semibold"
					>{showAddAddress ? 'Cancel' : 'Add'}
				</button>
			</div>
		</div>
	</div>
	{#if showAddAddress}
		<AddAddressForm
			data={update_address_form}
			{delayMs}
			{timeoutMs}
			{flyInParams}
			bind:processing
			on:toast={handleToast}
			on:cancel={() => (showAddAddress = false)}
		/>
	{:else if shipping_addresses.length > 0}
		<AddressBook data={shipping_addresses} {flipParams} bind:processing />
	{:else}
		No addresses saved
	{/if}
</div>
