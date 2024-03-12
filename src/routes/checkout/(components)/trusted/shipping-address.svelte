<script lang="ts">
	import type { Address } from '@medusajs/medusa/dist/models/address';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { AddressSchema } from './shipping-address-form.svelte';
	import { HomeIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import AddressBook from './address-book.svelte';
	import AddressCard from './address-card.svelte';
	import ShippingAddressForm from './shipping-address-form.svelte';
	import { createEventDispatcher } from 'svelte';

	export let form: SuperValidated<Infer<AddressSchema>>;
	export let shipping_address: Address | null;
	export let shipping_addresses: Address[] | undefined;

	let processing = false;
	let show_shipping_address_book = false;
	let show_shipping_address_form = false;

	const dispatch = createEventDispatcher();

	async function handle_address_form_success() {
		show_shipping_address_book = false;
		show_shipping_address_form = false;
		// trigger update to shipping options
		dispatch('success');
	}
</script>

<div class="mt-10">
	<div class="flex items-center space-x-2">
		<HomeIcon class="block h-5 w-5 text-gray-500 dark:text-gray-400" />
		<h3 class="text-lg font-medium text-gray-900">Shipping address</h3>
	</div>
	{#if shipping_address?.address_1 && !show_shipping_address_book}
		<div class="mt-6">
			<AddressCard data={shipping_address} {processing} is_selected={true} />
		</div>
		<Button on:click={() => (show_shipping_address_book = true)} variant="outline" class="mt-6"
			>Change address?</Button
		>
	{:else if !show_shipping_address_form && shipping_addresses}
		<AddressBook
			data={shipping_addresses}
			on:success={handle_address_form_success}
			on:new={() => (show_shipping_address_form = true)}
		/>
	{:else}
		<ShippingAddressForm
			data={form}
			{processing}
			on:success={handle_address_form_success}
			on:cancel={async () => {
				show_shipping_address_form = false;
			}}
		/>
	{/if}
</div>
