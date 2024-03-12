<script lang="ts" context="module">
	import { z } from 'zod';

	export const resetSchema = z
		.object({
			email: z.string().email(),
			password: z.string().min(6),
			confirmPassword: z.string().min(6),
			token: z.string()
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ['confirmPassword'] // path of error
		});

	export type ResetSchema = typeof resetSchema;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { handle_toast } from '$lib/utilities';

	export let data: SuperValidated<Infer<ResetSchema>>;

	const form = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				handle_toast(form.message);
				if (form.message.type === 'success') goto('/');
			}
		},
		validators: zodClient(resetSchema)
	});

	const { form: formData, submitting, enhance } = form;

</script>

<form use:enhance method="POST" class="space-y-6" id="reset-form">
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" />
		</Form.Control>
		<Form.Description>Using a password manager is highly recommended.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="confirmPassword">
		<Form.Control let:attrs>
			<Form.Label>Confirm Password</Form.Label>
			<Input {...attrs} bind:value={$formData.confirmPassword} type="password" />
		</Form.Control>
		<Form.Description>Must match the password you entered above.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	
	<Form.Button class="w-full" disabled={$submitting}>Reset</Form.Button>
</form>
