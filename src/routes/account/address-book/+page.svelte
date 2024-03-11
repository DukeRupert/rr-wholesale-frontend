<script lang="ts">
	import type { PageData } from './$types';
	import { LucidePlus, LucideMinus, MapPinned } from 'lucide-svelte';
	import { flip, type FlipParams } from 'svelte/animate';
	import AddressForm from './address-form.svelte';
	import AddressCard from '../(components)/address-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { handle_toast } from '$lib/utilities';

	export let data: PageData;
	
	let create = false;
	let processing = false;
	const flipParams: FlipParams = { duration: 500 };

	const toggleCreate = () => {
		create = !create;
	};
	
	const deleteAddress = async (id: string) => {
		try {
			processing = true;
			let res = await fetch('/api/address/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ address_id: id })
			});
			const { success } = await res.json();

			if (success) {
				handle_toast({ type: 'success', text: 'Address deleted' });
				// update address array
				let result = data.user.shipping_addresses.filter((el) => el.id !== id);
				data.user.shipping_addresses = result;
			} else {
				handle_toast({ type: 'error', text: 'Try again later.' });
			}
		} catch (err) {
			console.log(err);
			handle_toast({ type: 'error', text: 'Cannot communicate with the server.' });
		} finally {
			processing = false;
		}
	};

	const handleDelete = async (e: CustomEvent<{ address_id: string }>) => {
		const { address_id } = e.detail;
		if (!address_id) handle_toast({ type: 'error', text: 'Missing address. Try again later.' });
		await deleteAddress(address_id);
	};
</script>

<div class="space-y-6">
	<div class="md:flex md:items-center md:justify-between">
		<div class="min-w-0 flex-1">
			<h3 class="text-lg font-medium">Address Book</h3>
			<p class="text-sm text-muted-foreground">Save addresses to speed up your checkout flow.</p>
		</div>
		<div class="mt-4 flex md:ml-4 md:mt-0">
			<Button type="button" on:click={toggleCreate} variant="default"
				>{#if create}<LucideMinus class="mr-2 h-4 w-4" />Cancel{:else}<LucidePlus
						class="mr-2 h-4 w-4"
					/>Add new{/if}</Button
			>
		</div>
	</div>
	<Separator />
	{#if create}
		<AddressForm data={data.form} on:success={() => (create = false)} />
	{:else if data.user.shipping_addresses.length === 0}
		<button
			type="button"
			on:click={toggleCreate}
			class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			<MapPinned class="h-12 w-12 mx-auto text-muted-foreground" />
			<span class="mt-2 block text-sm font-semibold">Add your first address</span>
		</button>
	{:else}
		<ul role="list" class="mt-3 mb-8 sm:mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.user.shipping_addresses as address, i (address.id)}
				<li animate:flip={flipParams}>
					<AddressCard data={address} on:delete={handleDelete} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
