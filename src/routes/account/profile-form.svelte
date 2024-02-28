<script lang="ts" context="module">
	import { z } from 'zod';
	export const updateCustomerSchema = z.object({
		first_name: z
			.string()
			.min(2, 'Name must be at least 2 characters.')
			.max(30, 'Name must not be longer than 30 characters'),
		last_name: z
			.string()
			.min(2, 'Name must be at least 2 characters.')
			.max(30, 'Name must not be longer than 30 characters'),
		email: z.string().email(),
		phone: z.string().optional()
	});
	export type UpdateCustomerSchema = typeof updateCustomerSchema;
</script>

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	export let data: SuperValidated<Infer<typeof updateCustomerSchema>>;

	const form = superForm(data, {
		validators: zodClient(updateCustomerSchema)
	});

	const { form: formData, enhance } = form;

	let processing = false;
</script>

<form method="POST" class="space-y-8" id="profile-form" use:enhance>
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
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="phone">
		<Form.Control let:attrs>
			<Form.Label>Phone number</Form.Label>
			<Input {...attrs} bind:value={$formData.phone} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button disabled={processing}>Update Profile</Form.Button>
</form>
