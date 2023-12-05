<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Pagination from '$lib/components/elements/Pagination.svelte';
	import { quadOut, quadIn } from 'svelte/easing';
	import { flip, type FlipParams } from 'svelte/animate';
	import { fade, type FadeParams, fly, type FlyParams } from 'svelte/transition';

	export let data: PageData;
	//console.log(data.user)
	$: ({ id, email, first_name, last_name, phone, billing_address_id, shipping_addresses, orders } =
		data.user);
	$: orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	$: currentPage = data?.currentPage || 1;
	let opp = 10; // orders per page
	let processing = false;
	let editInfo = false;
	let editAddress = false;
	let changePassword = false;

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
						on:click={() => (editInfo = !editInfo)}
						class="relative inline-flex btn px-3 py-2 text-sm font-semibold"
						>{#if editInfo}
							Cancel
						{:else}
							Edit
						{/if}</button
					>
				</div>
			</div>
		</div>
		{#if editInfo}
			<form
				in:fly={flyInParams}
				action="?/editInfo"
				method="POST"
				use:enhance={async ({ cancel }) => {
					if (processing) cancel();
					processing = true;
					return async ({ formElement, result }) => {
						if (result.status === 200) {
							await invalidateAll();
							formElement.reset();
							editInfo = false;
						} else {
							console.log('failed');
						}
						processing = false;
					};
				}}
			>
				<div class="mt-5 mb-8 max-w-lg grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
					<div class="sm:col-span-6">
						<label for="first_name" class="block text-sm font-medium text-gray-700"
							>First Name</label
						>
						<input
							type="text"
							value={first_name}
							name="first_name"
							required
							class="block w-full input"
						/>
					</div>
					<div class="sm:col-span-6">
						<label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
						<input
							type="text"
							value={last_name}
							name="last_name"
							required
							class="block w-full input"
						/>
					</div>
					<div class="sm:col-span-7">
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input type="text" value={email} name="email" class="block w-full input" />
					</div>
					<div class="sm:col-span-5">
						<label for="last_name" class="block text-sm font-medium text-gray-700"
							>Phone (optional)</label
						>
						<input type="text" value={phone} name="phone" class="block w-full input" />
					</div>
					<div class="sm:col-span-6">
						<button disabled={processing} type="submit" class="mt-6 w-full btn">
							{#if processing}
								Processing...
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
				use:enhance={async ({ cancel }) => {
					if (processing) cancel();
					processing = true;
					return async ({ form, result }) => {
						if (result.status === 200) {
							await invalidateAll();
							form.reset();
							changePassword = false;
						} else {
							console.log('failed');
						}
						processing = false;
					};
				}}
			>
				<div class="max-w-lg mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
					<div class="sm:col-span-6">
						<label for="currentPassword" class="block text-sm font-medium text-gray-700"
							>Current Password</label
						>
						<input
							name="currentPassword"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full input"
						/>
					</div>
					<div class="sm:col-span-6"></div>
					<div class="sm:col-span-6">
						<label for="newPassword" class="block text-sm font-medium text-gray-700"
							>New Password</label
						>
						<input
							name="newPassword"
							type="password"
							autocomplete="new-password"
							required
							class="block w-full input"
						/>
					</div>
					<div class="sm:col-span-6">
						<label for="confirmPassword" class="block text-sm font-medium text-gray-700"
							>Confirm New Password</label
						>
						<input
							name="confirmPassword"
							type="password"
							autocomplete="new-password"
							required
							class="block w-full input"
						/>
					</div>
					<div class="sm:col-span-6">
						<button disabled={processing} type="submit" class="mt-6 w-full btn">
							{#if processing}
								Processing...
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
						on:click={() => (editAddress = !editAddress)}
						class="relative inline-flex btn px-3 py-2 text-sm font-semibold"
						>{#if editAddress}
							Cancel
						{:else}
							Add
						{/if}</button
					>
				</div>
			</div>
		</div>
		{#if editAddress}
			<form
				in:fly={flyInParams}
				action="?/addAddress"
				method="POST"
				use:enhance={async ({ cancel }) => {
					if (processing) cancel();
					processing = true;
					return async ({ formElement, result }) => {
						if (result.status === 200) {
							formElement.reset();
							await invalidateAll();
							editAddress = false;
						} else {
							console.log('failed');
						}
						processing = false;
					};
				}}
			>
				<div class="max-w-lg mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
					<div class="sm:col-span-6">
						<label for="first_name" class="block text-sm font-medium text-gray-700"
							>First Name</label
						>
						<input type="text" name="first_name" required class="block w-full input" />
					</div>
					<div class="sm:col-span-6">
						<label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
						<input type="text" name="last_name" required class="block w-full input" />
					</div>
					<div class="sm:col-span-12">
						<label for="company" class="block text-sm font-medium text-gray-700">Company</label>
						<input type="text" name="company" class="block w-full input" />
					</div>
					<div class="sm:col-span-12">
						<label for="address_1" class="block text-sm font-medium text-gray-700"
							>Address Line 1</label
						>
						<input type="text" name="address_1" required class="block w-full input" />
					</div>
					<div class="sm:col-span-12">
						<label for="address_2" class="block text-sm font-medium text-gray-700"
							>Address Line 2</label
						>
						<input type="text" name="address_2" class="block w-full input" />
					</div>
					<div class="sm:col-span-8">
						<label for="city" class="block text-sm font-medium text-gray-700">City</label>
						<input type="text" name="city" required class="block w-full input" />
					</div>
					<div class="sm:col-span-4">
						<label for="province" class="block text-sm font-medium text-gray-700">State</label>
						<input type="text" name="province" required class="block w-full input" />
					</div>
					<div class="sm:col-span-4">
						<label for="postal_code" class="block text-sm font-medium text-gray-700"
							>Postal Code</label
						>
						<input type="text" name="postal_code" required class="block w-full input" />
					</div>
					<div class="sm:col-span-8">
						<label for="last_name" class="block text-sm font-medium text-gray-700"
							>Phone (optional)</label
						>
						<input type="text" name="phone" class="block w-full input" />
					</div>
					<div class="sm:col-span-6">
						<button disabled={processing} type="submit" class="mt-6 w-full btn">
							{#if processing}
								Processing...
							{:else}
								Save
							{/if}
						</button>
					</div>
					<div class="sm:col-span-6">
						<button
							hidden={processing}
							on:click|preventDefault={() => {
								editAddress = false;
							}}
							type="button"
							class="mt-6 w-full btn btn-secondary"
						>
							Cancel
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
			<!-- <div class="border rounded-md p-4 mr-3 mb-2">
						<h3>{address.first_name} {address.last_name}</h3>
						<p>{address.address_1}</p>
						{#if address.address_2}
							<p>{address.address_2}</p>
						{/if}
						<p>{address.city}, {address.province}</p>
						<p>{address.postal_code}</p>
						{#if address.phone}
							<p>{address.phone}</p>
						{/if}
						<div class="mt-3">
							<button class="text-thunderbird-600 hover:text-thunderbird-500 pr-2">Edit</button>
							<form
								class="inline"
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
								<button type="submit" class="text-thunderbird-600 hover:text-thunderbird-500 pl-2"
									>Delete</button
								>
								<input type="hidden" name="addressId" value={address.id} />
							</form>
						</div>
					</div> -->
		{:else}
			No addresses saved
		{/if}

		<!-- Orders -->
		<div
			class="border-b border-gray-200 dark:border-gray-600 px-4 py-5 sm:px-6 mt-8 sm:mt-12 lg:mt-20"
		>
			<div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
				<div class="ml-4 mt-2">
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Orders</h3>
				</div>
			</div>
		</div>
		{#if orders?.length}
			{#each orders as order, i}
				{#if i >= currentPage * opp - opp && i < currentPage * opp}
					<div class="sm:flex sm:flex-wrap my-3 justify-between dark:text-gray-200">
						<div class="mr-2 block sm:inline">
							{new Date(order.created_at).toLocaleDateString('us-EN', {
								month: 'long',
								day: 'numeric',
								year: 'numeric'
							})}
						</div>
						<div class="mr-2 block sm:inline">
							Order Num: {order.display_id}
						</div>
						<div class="mr-2 block sm:inline">
							{order.fulfillment_status === 'fulfilled' ? 'Shipped' : 'Pending'}
						</div>
						<div>
							<a
								href={`/account/order/${order.id}`}
								class="text-thunderbird-600 hover:text-thunderbird-500 mr-3">View / Track</a
							>
						</div>
					</div>
				{/if}
			{/each}
			<Pagination bind:currentPage itemCount={orders.length} itemsPerPage={opp} />
		{:else}
			<div class="my-3">No orders yet</div>
		{/if}
	</div>
</div>
