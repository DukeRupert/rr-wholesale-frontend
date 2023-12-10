<script lang="ts">
	import type { ShippingOption } from '$lib/types/cart';
	import { formatPrice } from '$lib/utilities';
	import { TruckIcon } from 'lucide-svelte';

	export let data: ShippingOption;
</script>

<div class="flex flex-col px-2 py-4 rounded-lg bg-white dark:bg-gray-800 shadow">
	<div class="flex items-center space-x-4">
		<TruckIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" />
		<h3 class="block text-sm font-medium text-gray-900 dark:text-gray-100">
			{data.name}
		</h3>
		<p class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
			{formatPrice(data.amount)}
		</p>
	</div>
</div>
