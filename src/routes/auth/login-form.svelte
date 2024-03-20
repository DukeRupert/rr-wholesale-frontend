<script lang="ts" context="module">
	import { z } from 'zod';

	export const loginSchema = z.object({
		email: z
			.string()
			.email()
			.refine((val) => val.length > 0, {
				message: 'Email is required'
			}),
		password: z.string().min(6)
	});

	export type LoginSchema = typeof loginSchema;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { handle_toast } from '$lib/utilities';
	import { tick } from 'svelte';

	export let return_url: string;
	export let data: SuperValidated<Infer<LoginSchema>>;

	const form = superForm(data, {
		onUpdated: async ({ form }) => {
			if (form.message) {
				handle_toast(form.message);
				return;
			}
			await tick()
			await goto(`/${return_url}`);
		},
		validators: zodClient(loginSchema)
	});

	const { form: formData, submitting, enhance } = form;
</script>

<form use:enhance action="?/login" method="POST" class="space-y-6" id="login-form">
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
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" disabled={$submitting}>Sign in</Form.Button>
</form>
