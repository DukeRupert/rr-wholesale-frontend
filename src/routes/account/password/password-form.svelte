<script lang="ts" context="module">
	import { z } from 'zod';

	export const passwordSchema = z
		.object({
			newPassword: z.string().min(6),
			confirmPassword: z.string().min(6),
			rurl: z.string().default('')
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: "Passwords don't match",
			path: ['confirmPassword'] // path of error
		});
	export type PasswordSchema = typeof passwordSchema;
</script>

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { handle_toast } from '$lib/utilities';
	import { goto } from '$app/navigation';

	export let data: SuperValidated<Infer<PasswordSchema>>;
	export let return_url: string;

	const form = superForm(data, {
		onUpdated({ form }) {
			if (form.message) {
				handle_toast(form.message);
				return;
			}
			if (return_url !== '') goto(`/${return_url}`);
		},
		validators: zodClient(passwordSchema)
	});

	const { form: formData, submitting, enhance } = form;
</script>

<form use:enhance method="POST" class="space-y-8" id="profile-form">
	<Form.Field {form} name="newPassword">
		<Form.Control let:attrs>
			<Form.Label>New password</Form.Label>
			<Input {...attrs} bind:value={$formData.newPassword} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<Form.Control let:attrs>
			<Form.Label>Confirm password</Form.Label>
			<Input {...attrs} bind:value={$formData.confirmPassword} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button disabled={$submitting}>Update Profile</Form.Button>
</form>
