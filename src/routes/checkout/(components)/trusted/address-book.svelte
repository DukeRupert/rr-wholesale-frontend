<script lang="ts">
	import type { Select_Address_Payload } from './address-card.svelte';
	import type { Address } from '@medusajs/medusa/dist/models/address';
	import { LucidePlus } from 'lucide-svelte';
	import AddressCard from './address-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { createEventDispatcher } from 'svelte';
	import { trim_address } from '$lib/utilities';
	import { handle_toast } from '$lib/utilities';

	export let data: Address[];
	let processing = false;

	const dispatch = createEventDispatcher();

	async function select_shipping_address(a: Address) {
		try {
			processing = true;
			const address = trim_address(a);
			const res = await fetch('/api/checkout/select-shipping-address', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ shipping_address: address })
			});
			const { success } = await res.json();
			if (success) {
				dispatch('success')
				handle_toast({ type: 'success', text: 'Shipping adddress saved' });
			} else {
				handle_toast({ type: 'error', text: 'Invalid address' });
			}
		} catch (err) {
			console.log(err);
			handle_toast({ type: 'error', text: 'Invalid address' });
		} finally {
			processing = false;
		}
	}

	async function handle_select(e: CustomEvent<Select_Address_Payload>) {
		let { shipping_address } = e?.detail;
		if (!shipping_address) handle_toast({ type: 'error', text: 'Invalid address' });
		await select_shipping_address(shipping_address);
	}
</script>

<ul role="list" class="mt-3 mb-8 sm:mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	{#each data as address, i (address.id)}
		<AddressCard data={address} {processing} on:select={handle_select} />
	{/each}
	<!-- Create new address -->
	<Button
		type="button"
		variant="outline"
		class="flex flex-col h-full w-full justify-center items-center py-4 border-dashed"
		on:click={() => dispatch('new')}
	>
		<LucidePlus class="h2-5 w-5"></LucidePlus>
		<p class="text-muted-foreground">Create new address</p>
	</Button>
</ul>
