<script lang="ts">
    import type { ShippingAddress } from "$lib/types/user";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { flip, type FlipParams } from 'svelte/animate'

    export let data: ShippingAddress[] = []
    export let processing: boolean;
    export let flipParams: FlipParams;
</script>

<ul role="list" class="mt-3 mb-8 sm:mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data as address, i (address.id)}
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