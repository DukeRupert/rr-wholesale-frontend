<script lang="ts" context="module">
	import { z } from 'zod';

	export const contactSchema = z.object({
		email: z
			.string()
			.email()
			.refine((val) => val.length > 0, {
				message: 'Email is required'
			}),
		first_name: z.string().min(1).max(200),
		last_name: z.string().min(1).max(200),
		business_name: z.string().min(1).max(200),
		phone: z.string().min(1).max(15)
	});

	export type ContactSchema = typeof contactSchema;
</script>

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { handle_toast } from '$lib/utilities';

	export let data: SuperValidated<Infer<ContactSchema>>;

	const form = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				handle_toast(form.message);
				return;
			}
		},
		validators: zodClient(contactSchema)
	});

	const { form: formData, submitting, enhance } = form;
</script>

<form use:enhance method="POST" class="space-y-6" id="login-form">

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

	<Form.Field {form} name="business_name">
		<Form.Control let:attrs>
			<Form.Label>Business name</Form.Label>
			<Input {...attrs} bind:value={$formData.business_name} />
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
	<Form.Button class="w-full" disabled={$submitting}>Send</Form.Button>
</form>
