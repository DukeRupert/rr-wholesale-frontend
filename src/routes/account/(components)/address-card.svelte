<script lang="ts">
	import type { Address } from '@medusajs/medusa/dist/models/address';
	import { createEventDispatcher } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	export let data: Address;

	const dispatch = createEventDispatcher<{ delete: { address_id: string } }>();
	const handleClick = () => {
		dispatch('delete', { address_id: data.id });
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{data.first_name} {data.last_name}</Card.Title>
		<Card.Description>{data.company || "_"}</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>{data.address_1}</p>
		{#if data.address_2}
			<p>{data.address_2}</p>
		{/if}
		<p>{data.city}, {data.province} {data.postal_code}</p>
	</Card.Content>
	<Card.Footer>
		<Button type="button" variant="outline" on:click={handleClick}>Delete</Button>
	</Card.Footer>
</Card.Root>
