<script lang="ts">
	import type { Shippingaddress } from '$lib/types/user';

	export let address: Shippingaddress;
	console.log(address);
</script>

<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
	<div class="flex flex-col w-full justify-between p-6">
		<p class="block text-sm font-medium text-gray-900">{address.first_name} {address.last_name}</p>
		{#if address.company}
			<p class="block text-sm font-medium text-gray-900">{address.company}</p>
		{/if}
		<p class="mt-1 flex items-center text-sm text-gray-500">{address.address_1}</p>
		{#if address.address_2}
			<p class="mt-1 flex items-center text-sm text-gray-500">{address.address_2}</p>
		{/if}
		<p class="mt-1 flex items-center text-sm text-gray-500">
			{address.city}, {address.province}
			{address.postal_code}
		</p>
		{#if address.phone}
			<p class="mt-1 flex items-center text-sm text-gray-500">{address.phone}</p>
		{/if}
	</div>
	<div>
		<div class="-mt-px flex divide-x divide-gray-200">
			<div class="flex w-0 flex-1">
				<a
					href="mailto:janecooper@example.com"
					class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 capitalize"
				>
					edit
				</a>
			</div>
			<div class="-ml-px flex w-0 flex-1">
				<a
					href="tel:+1-202-555-0170"
					class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 capitalize"
				>
					delete
				</a>
			</div>
		</div>
	</div>
</li>
