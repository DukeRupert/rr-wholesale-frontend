<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import {
		addShippingAddressSchema,
		changePasswordSchema,
		editUserSchema
	} from '$lib/validators/account';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { quadOut } from 'svelte/easing';
	import { flip, type FlipParams } from 'svelte/animate';
	import { fly, type FlyParams } from 'svelte/transition';
	import { addToast } from '$lib/components/toast/index.svelte';
	import { AlertCircle } from 'lucide-svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';

	export let data: PageData;

	$: ({ email, first_name, last_name, phone, shipping_addresses } = data.user);
	let processing = false;
	let editUserInfo = false;
	let addAddress = false;
	let changePassword = false;

	// Form configuration
	const delayMs = 200;
	const timeoutMs = 8000;

	// Get forms
	const {
		form: editUserForm,
		errors: editUserFormErrors,
		constraints: editUserFormConstraints,
		delayed: editUserFormDelayed,
		enhance: editUserFormEnhance
	} = superForm(data.editUserForm, {
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
				// Success
				addToast({
					data: {
						type: 'success',
						title: 'Success',
						description: 'Contact information updated.'
					}
				});
				editUserInfo = false; // close the form
			}
			// Wrap things up
			processing = false; // end process
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
		validators: editUserSchema,
		invalidateAll: true,
		taintedMessage: null,
		delayMs: delayMs,
		timeoutMs: timeoutMs
	});

	const {
		form: changePasswordForm,
		errors: changePasswordFormErrors,
		constraints: changePasswordFormConstraints,
		delayed: changePasswordFormDelayed,
		enhance: changePasswordFormEnhance
	} = superForm(data.changePasswordForm, {
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
				// Success
				addToast({
					data: {
						type: 'success',
						title: 'Success',
						description: 'Password updated.'
					}
				});
				changePassword = false; // close the form
			}
			// Wrap things up
			processing = false; // end process
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
		validators: changePasswordSchema,
		resetForm: true,
		taintedMessage: null,
		delayMs: delayMs,
		timeoutMs: timeoutMs
	});

	const {
		form: addAddressForm,
		errors: addAddressFormErrors,
		constraints: addAddressFormConstraints,
		delayed: addAddressFormDelayed,
		enhance: addAddressFormEnhance
	} = superForm(data.addAddressForm, {
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
				// Success
				addToast({
					data: {
						type: 'success',
						title: 'Success',
						description: 'Address information updated.'
					}
				});
				addAddress = false; // close the form
			}
			// Wrap things up
			processing = false; // end process
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
		validators: addShippingAddressSchema,
		invalidateAll: true,
		taintedMessage: null,
		delayMs: delayMs,
		timeoutMs: timeoutMs
	});

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
</script>

<div class="max-w-screen-2xl dark:bg-gray-900 mx-auto py-6 px-6 md:px-8 sm:px-6">
	<div class="max-w-5xl mx-auto mb-12 text-center">
		<h1
			class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center"
		>
			Your Account
		</h1>
	</div>

	<div class="max-w-screen-lg mx-auto">
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
						on:click={() => (editUserInfo = !editUserInfo)}
						class="relative inline-flex btn px-3 py-2 text-sm font-semibold"
						>{#if editUserInfo}
							Cancel
						{:else}
							Edit
						{/if}</button
					>
				</div>
			</div>
		</div>
		{#if editUserInfo}
			<form in:fly={flyInParams} action="?/editUserInfo" method="POST" use:editUserFormEnhance>
				<div class="mt-5 mb-8 max-w-lg grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
					<div class="sm:col-span-6">
						<label for="first_name" class="label">First Name</label>
						<div class="relative mt-2">
							<input
								type="text"
								name="first_name"
								required
								class="block w-full input"
								aria-invalid={$editUserFormErrors.first_name ? 'true' : undefined}
								bind:value={$editUserForm.first_name}
								{...$editUserFormConstraints.first_name}
							/>
							{#if $editUserFormErrors.first_name}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
						{#if $editUserFormErrors.first_name}
							<p class="mt-2 text-sm text-red-600" id="email-error">
								{$editUserFormErrors.first_name}
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
								aria-invalid={$editUserFormErrors.last_name ? 'true' : undefined}
								bind:value={$editUserForm.last_name}
								{...$editUserFormConstraints.last_name}
							/>
							{#if $editUserFormErrors.last_name}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
						{#if $editUserFormErrors.last_name}
							<p class="mt-2 text-sm text-red-600" id="email-error">
								{$editUserFormErrors.last_name}
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
								aria-invalid={$editUserFormErrors.email ? 'true' : undefined}
								bind:value={$editUserForm.email}
								{...$editUserFormConstraints.email}
							/>
							{#if $editUserFormErrors.email}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
						{#if $editUserFormErrors.email}
							<p class="mt-2 text-sm text-red-600" id="email-error">
								{$editUserFormErrors.email}
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
								aria-invalid={$editUserFormErrors.phone ? 'true' : undefined}
								bind:value={$editUserForm.phone}
								{...$editUserFormConstraints.phone}
							/>
							{#if $editUserFormErrors.phone}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
						{#if $editUserFormErrors.phone}
							<p class="mt-2 text-sm text-red-600" id="email-error">
								{$editUserFormErrors.phone}
							</p>
						{/if}
					</div>
					<div class="sm:col-span-6">
						<button type="submit" disabled={processing} class="mt-6 flex w-full btn">
							{#if processing && $editUserFormDelayed}
								<Spinner /> &nbsp; Processing...
							{:else}
								Save
							{/if}
						</button>
					</div>
				</div>
			</form>
		{:else if changePassword}
			<form
				in:fly={flyInParams}
				action="?/changePassword"
				method="POST"
				use:changePasswordFormEnhance
			>
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
								aria-invalid={$changePasswordFormErrors.newPassword ? 'true' : undefined}
								bind:value={$changePasswordForm.newPassword}
								{...$changePasswordFormConstraints.newPassword}
							/>
							{#if $changePasswordFormErrors.newPassword}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
						{#if $changePasswordFormErrors.newPassword}
							<p class="mt-2 text-sm text-red-600" id="email-error">
								{$changePasswordFormErrors.newPassword}
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
								aria-invalid={$changePasswordFormErrors.confirmPassword ? 'true' : undefined}
								bind:value={$changePasswordForm.confirmPassword}
								{...$changePasswordFormConstraints.confirmPassword}
							/>
							{#if $changePasswordFormErrors.confirmPassword}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
						{#if $changePasswordFormErrors.confirmPassword}
							<p class="mt-2 text-sm text-red-600" id="email-error">
								{$changePasswordFormErrors.confirmPassword}
							</p>
						{/if}
					</div>
					<div class="sm:col-span-6">
						<button disabled={processing} type="submit" class="mt-6 flex w-full btn">
							{#if processing && $changePasswordFormDelayed}
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
								changePassword = false;
							}}
							type="button"
							class="mt-6 w-full btn btn-secondary"
						>
							Cancel
						</button>
					</div>
				</div>
			</form>
		{:else}
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
					changePassword = true;
				}}
				class="text-thunderbird-600 hover:text-thunderbird-500 mt-3">Change Password</button
			>
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
						on:click={() => (addAddress = !addAddress)}
						class="relative inline-flex btn px-3 py-2 text-sm font-semibold"
						>{#if addAddress}
							Cancel
						{:else}
							Add
						{/if}</button
					>
				</div>
			</div>
		</div>
		{#if addAddress}
			<form in:fly={flyInParams} action="?/addAddress" method="POST" use:addAddressFormEnhance>
				<div class="max-w-lg mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
					<div class="sm:col-span-6">
						<label for="first_name" class="label">First Name</label>
						<div class="relative mt-2">
							<input
								type="text"
								name="first_name"
								required
								class="block w-full input"
								aria-invalid={$addAddressFormErrors.first_name ? 'true' : undefined}
								bind:value={$addAddressForm.first_name}
								{...$addAddressFormConstraints.first_name}
							/>
							{#if $addAddressFormErrors.first_name}
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
								aria-invalid={$addAddressFormErrors.last_name ? 'true' : undefined}
								bind:value={$addAddressForm.last_name}
								{...$addAddressFormConstraints.last_name}
							/>
							{#if $addAddressFormErrors.last_name}
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
								aria-invalid={$addAddressFormErrors.company ? 'true' : undefined}
								bind:value={$addAddressForm.company}
								{...$addAddressFormConstraints.company}
							/>
							{#if $addAddressFormErrors.company}
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
								aria-invalid={$addAddressFormErrors.address_1 ? 'true' : undefined}
								bind:value={$addAddressForm.address_1}
								{...$addAddressFormConstraints.address_1}
							/>
							{#if $addAddressFormErrors.address_1}
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
								aria-invalid={$addAddressFormErrors.address_2 ? 'true' : undefined}
								bind:value={$addAddressForm.address_2}
								{...$addAddressFormConstraints.address_2}
							/>
							{#if $addAddressFormErrors.address_2}
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
								aria-invalid={$addAddressFormErrors.city ? 'true' : undefined}
								bind:value={$addAddressForm.city}
								{...$addAddressFormConstraints.city}
							/>
							{#if $addAddressFormErrors.city}
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
								aria-invalid={$addAddressFormErrors.province ? 'true' : undefined}
								bind:value={$addAddressForm.province}
								{...$addAddressFormConstraints.province}
							/>
							{#if $addAddressFormErrors.province}
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
								aria-invalid={$addAddressFormErrors.postal_code ? 'true' : undefined}
								bind:value={$addAddressForm.postal_code}
								{...$addAddressFormConstraints.postal_code}
							/>
							{#if $addAddressFormErrors.postal_code}
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
								aria-invalid={$addAddressFormErrors.phone ? 'true' : undefined}
								bind:value={$addAddressForm.phone}
								{...$addAddressFormConstraints.phone}
							/>
							{#if $addAddressFormErrors.phone}
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<AlertCircle class="h-5 w-5 text-red-500" />
								</div>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-6">
						<button disabled={processing} type="submit" class="mt-6 flex w-full btn">
							{#if processing && $addAddressFormDelayed}
								<Spinner /> &nbsp; Processing...
							{:else}
								Save
							{/if}
						</button>
					</div>
				</div>
			</form>
		{:else if shipping_addresses.length > 0}
			<ul
				role="list"
				class="mt-3 mb-8 sm:mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each shipping_addresses as address, i (address.id)}
					<li
						animate:flip={flipParams}
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
								<form
									class="-ml-px flex w-0 flex-1"
									action="?/deleteAddress"
									method="POST"
									use:enhance={async ({ cancel }) => {
										return async ({ result }) => {
											if (result.status === 200) {
												await invalidateAll();
											} else {
												console.log('failed');
											}
											processing = false;
										};
									}}
								>
									<button
										type="submit"
										class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-thunderbird-600 dark:hover:text-thunderbird-500 capitalize"
									>
										delete
									</button>
									<input type="hidden" name="addressId" value={address.id} />
								</form>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			No addresses saved
		{/if}
	</div>
</div>
