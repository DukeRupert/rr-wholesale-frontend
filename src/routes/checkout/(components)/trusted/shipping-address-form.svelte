<script lang="ts" context="module">
	import { z } from 'zod';

	export const addressSchema = z.object({
		first_name: z.string(),
		last_name: z.string(),
		company: z.string().optional().default(''),
		address_1: z.string(),
		address_2: z.string().optional().default(''),
		city: z.string(),
		province: z.string(),
		phone: z.string().optional().default(''),
		postal_code: z.string(),
		country_code: z.string().toLowerCase().default('us')
	});

	export type AddressSchema = typeof addressSchema;
</script>

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { handle_toast } from '$lib/utilities';
	import { createEventDispatcher } from 'svelte';

	export let data: SuperValidated<Infer<AddressSchema>>;

	const dispatch = createEventDispatcher();

	const form = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				handle_toast(form.message);
				return;
			} else {
				handle_toast({type: 'success', text: "Address updated"})
				dispatch('success')
			}
		},
		validators: zodClient(addressSchema),
		invalidateAll: true
	});

	const { form: formData, submitting, enhance } = form;

	export let processing: boolean;
</script>

<form
	use:enhance
	id="shipping-address-form"
	method="POST"
	action="?/updateShippingAddress"
	class="mt-4 space-y-8"
>
	<Form.Field {form} name="first_name">
		<Form.Control let:attrs>
			<Form.Label>First name</Form.Label>
			<Input {...attrs} bind:value={$formData.first_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="last_name">
		<Form.Control let:attrs>
			<Form.Label>Last name</Form.Label>
			<Input {...attrs} bind:value={$formData.last_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="company">
		<Form.Control let:attrs>
			<Form.Label>Company</Form.Label>
			<Input {...attrs} bind:value={$formData.company} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="address_1">
		<Form.Control let:attrs>
			<Form.Label>Address line 1</Form.Label>
			<Input {...attrs} bind:value={$formData.address_1} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="address_2">
		<Form.Control let:attrs>
			<Form.Label>Address line 2</Form.Label>
			<Input {...attrs} bind:value={$formData.address_2} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="city">
		<Form.Control let:attrs>
			<Form.Label>City</Form.Label>
			<Input {...attrs} bind:value={$formData.city} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="province">
		<Form.Control let:attrs>
			<Form.Label>State</Form.Label>
			<Input {...attrs} bind:value={$formData.province} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="postal_code">
		<Form.Control let:attrs>
			<Form.Label>Zip code</Form.Label>
			<Input {...attrs} bind:value={$formData.postal_code} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="mt-10 flex justify-end space-x-6 border-t border-gray-200 pt-6">
		<Button type="submit" disabled={$submitting}>Confirm</Button>
		<Button on:click={() => dispatch('cancel')} type="button" variant="outline">Cancel</Button>
	</div>
</form>
