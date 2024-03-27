<script lang="ts">
	import type { Item, Order } from '$lib/types/user';
	import { formatDate, formatPrice, fromISOtoDatetime } from '$lib/utilities';
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { fly, type FlyParams } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { ChevronUp } from 'lucide-svelte';
	import Badge from '$lib/components/elements/Badge.svelte';

	export let data: Order;

	function convertStatus(status: string) {
		switch (status) {
			case 'fulfilled':
				return {status: 'fulfilled', type: 'fulfilled'};
			default:
				return {status: 'pending', type: ''};
		}
	}

	function calculateTotal(items: Item[]) {
		let total = 0;
		let subtotals: number[] = []

		subtotals = items.map((el) => {
			return el.unit_price * el.quantity
		})

		total = subtotals.reduce((pre, cur) => pre + cur)
		return total
	}

	// https://www.melt-ui.com/docs/builders/collapsible
	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible();

	// Animation
	const slideParams: FlyParams = {
		x: 100,
		duration: 150,
		easing: quadOut
	};
</script>

<div use:melt={$root}>
	<h3 class="sr-only">
		data placed on <time datetime={fromISOtoDatetime(data.created_at)}
			>{formatDate(data.created_at)}</time
		>
	</h3>

	<div
		class="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8"
	>
		<dl
			class="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-5 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:gap-x-8"
		>
			<div class="flex justify-between sm:block">
				<dt class="font-medium text-gray-900">Date placed</dt>
				<dd class="sm:mt-1">
					<time datetime={fromISOtoDatetime(data.created_at)}>{formatDate(data.created_at)}</time>
				</dd>
			</div>
			<div class="flex justify-between pt-6 sm:block sm:pt-0">
				<dt class="font-medium text-gray-900">Order number</dt>
				<dd class="sm:mt-1">#{data.display_id}</dd>
			</div>
			<div class="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
				<dt>Total amount</dt>
				<dd class="sm:mt-1">{formatPrice(calculateTotal(data.items))}</dd>
			</div>
			<div class="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
				<dt>Status</dt>
				<dd class="sm:mt-1"><Badge {...convertStatus(data.fulfillment_status)}/></dd>
			</div>
			<div class="flex justify-center pt-6 font-medium text-gray-900 sm:block sm:pt-0">
				<button class="flex btn px-2 py-2" use:melt={$trigger} aria-label="toggle"
					><ChevronUp
						class="h-5 w-5 mr-2 transform duration-150 ease-out {$open ? 'rotate-180' : undefined}"
					/>{$open ? 'Hide items' : 'View items'}</button
				>
			</div>
		</dl>
		<!-- <a
			href="#"
			class="mt-6 flex w-full items-center justify-center rounded-md bdata border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-thunderbird-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
		>
			View Invoice
			<span class="sr-only">for data WU88191111</span>
		</a> -->
	</div>
	{#if $open}
		<table
			use:melt={$content}
			transition:fly={slideParams}
			class="mt-4 w-full text-gray-500 sm:mt-6"
		>
			<caption class="sr-only"> Products </caption>
			<thead class="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
				<tr>
					<th scope="col" class="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">Product</th>
					<th scope="col" class="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Price</th>
					<th scope="col" class="hidden py-3 pr-8 font-normal sm:table-cell">Quantity</th>
					<th scope="col" class="w-0 py-3 text-right font-normal">Info</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
				{#each data.items as item, i}
					<tr>
						<td class="py-6 pr-8">
							<div class="flex items-center">
								<img
									src={item.thumbnail}
									alt={item.title}
									class="mr-6 h-16 w-16 rounded object-cover object-center"
								/>
								<div>
									<div class="font-medium text-gray-900">{item.title}</div>
									<div class="mt-1 sm:hidden">{formatPrice(item.unit_price)}</div>
								</div>
							</div>
						</td>
						<td class="hidden py-6 pr-8 sm:table-cell">{formatPrice(item.unit_price)}</td>
						<td class="hidden py-6 pr-8 sm:table-cell">{item.quantity}</td>
						<td class="whitespace-nowrap py-6 text-right font-medium">
							<a href={item?.metadata?.handle ?? "#"} class="text-thunderbird-600"
								>View<span class="hidden lg:inline"> Product</span><span class="sr-only"
									>, {item.title}</span
								></a
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
