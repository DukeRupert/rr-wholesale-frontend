<script lang="ts" context="module">
	import { z } from 'zod';

	export const resetSchema = z
		.object({
			password: z.string().min(6),
			confirmPassword: z.string().min(6)
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ['confirmPassword'] // path of error
		});

	export type ResetSchema = typeof resetSchema;
</script>

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { handle_toast } from '$lib/utilities';
	import { tick } from 'svelte';

	export let data: SuperValidated<Infer<ResetSchema>>;

	const form = superForm(data, {
		onUpdated: async ({ form }) => {
			if (form.message) {
				handle_toast(form.message);
				const url = 'https://admin.rockabillyroasting.shop/';
				if (form.message.type === 'success') {
					await tick();
					window.location.assign(url);
				}
			}
		},
		validators: zodClient(resetSchema)
	});

	const { form: formData, submitting, enhance } = form;
</script>

<form use:enhance method="POST" class="space-y-6" id="reset-form">
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
