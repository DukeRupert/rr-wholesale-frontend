<script lang="ts">
	import type { ShippingAddress } from '$lib/types/user';

	export let data: ShippingAddress;
</script>

<div>
	<p class="block text-sm font-medium text-gray-900 dark:text-gray-100">
		{data.first_name}
		{data.last_name}
	</p>
	{#if data.company}
		<p class="block text-sm font-medium text-gray-900 dark:text-gray-100">
			{data.company}
		</p>
	{/if}
	<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
		{data.address_1}
	</p>
	{#if data.address_2}
		<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
			{data.address_2}
		</p>
	{/if}
	<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
		{data.city}, {data.province}
		{data.postal_code}
	</p>
	{#if data.phone}
		<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
			{data.phone}
		</p>
	{/if}
</div>
