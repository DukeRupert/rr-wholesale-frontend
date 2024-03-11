<script lang="ts" context="module">
	export interface Select_Address_Event {
		select: { shipping_address: Address };
	}

	export interface Select_Address_Payload {
		shipping_address: Address;
	}
</script>

<script lang="ts">
	import type { Address } from '@medusajs/medusa/dist/models/address';
	import { createEventDispatcher } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	export let data: Address;
	export let processing: boolean;
	export let is_selected: boolean = false;

	const dispatch = createEventDispatcher<Select_Address_Event>();
	const handleClick = () => {
		dispatch('select', { shipping_address: data });
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{data.first_name} {data.last_name}</Card.Title>
		<Card.Description>{data.company || '_'}</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>{data.address_1}</p>
		{#if data.address_2}
			<p>{data.address_2}</p>
		{/if}
		<p>{data.city}, {data.province} {data.postal_code}</p>
	</Card.Content>
	<Card.Footer>
		{#if !is_selected}<Button
				type="button"
				variant="outline"
				class="w-full"
				on:click={handleClick}
				disabled={processing}>Select</Button
			>
		{/if}
	</Card.Footer>
</Card.Root>
