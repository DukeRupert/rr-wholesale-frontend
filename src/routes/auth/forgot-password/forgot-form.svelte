<script lang="ts" context="module">
	import { z } from 'zod';

	export const forgotSchema = z.object({
		email: z
			.string()
			.email()
			.refine((val) => val.length > 0, {
				message: 'Email is required'
			})
	});

	export type ForgotSchema = typeof forgotSchema;
</script>

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { handle_toast } from '$lib/utilities';


	export let data: SuperValidated<Infer<ForgotSchema>>;

	const form = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				handle_toast(form.message);
				return;
			}
		},
		validators: zodClient(forgotSchema)
	});

	const { form: formData, submitting, enhance } = form;
</script>

<form use:enhance method="POST" class="space-y-6" id="forgot-form">
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" disabled={$submitting}>Submit</Form.Button>
</form>
