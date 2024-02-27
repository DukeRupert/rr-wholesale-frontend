<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { contactSalesSchema } from '$lib/validators/auth';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { AlertCircle } from 'lucide-svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import Spinner from '$lib/components/elements/Spinner.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	export let data: SuperValidated<Infer<typeof contactSalesSchema>>;

	const { form, errors, tainted, message, submitting, delayed, timeout, enhance } = superForm(
		data,
		{
			onUpdated({ form }) {
				if (form.message) {
					addToast({
						data: {
							type: form.message.type,
							title: form.message.type,
							description: form.message.text
						}
					});
				}
			},
			onError({ result }) {
				addToast({
					data: {
						type: 'error',
						title: 'Error',
						description: result.error.message
					}
				});
			},
			resetForm: false,
			validators: zodClient(contactSalesSchema),
			invalidateAll: true,
			taintedMessage: null,
			delayMs: 200,
			timeoutMs: 8000
		}
	);
</script>

<form use:enhance method="POST" class="space-y-6">
	<input type="text" name="password" class="hidden" value="" />
	<div>
		<Label for="first_name">First</Label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<Input
				id="first_name"
				name="first_name"
				type="text"
				autocomplete="email"
				required
				class="block w-full input"
				aria-invalid={$form.first_name ? 'true' : undefined}
				aria-describedby={$errors.first_name ? 'first_name-error' : undefined}
				bind:value={$form.first_name}
			/>
			{#if $errors.first_name}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-destructive" />
				</div>
			{/if}
		</div>
		{#if $errors.first_name}
			<p class="mt-2 text-sm text-destructive" id="first_name-error">{$errors.first_name}</p>
		{/if}
	</div>
	<div>
		<Label for="last_name">Last</Label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<Input
				id="last_name"
				name="last_name"
				type="text"
				autocomplete="email"
				required
				class="block w-full input"
				aria-invalid={$form.last_name ? 'true' : undefined}
				aria-describedby={$errors.last_name ? 'last_name-error' : undefined}
				bind:value={$form.last_name}
			/>
			{#if $errors.last_name}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-destructive" />
				</div>
			{/if}
		</div>
		{#if $errors.last_name}
			<p class="mt-2 text-sm text-destructive" id="last_name-error">{$errors.last_name}</p>
		{/if}
	</div>
	<div>
		<Label for="email">Email</Label>
		<div class="relative mt-2 rounded-md shadow-sm">
			<Input
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				required
				class="block w-full input"
				aria-invalid={$form.email ? 'true' : undefined}
				aria-describedby={$errors.email ? 'email-error' : undefined}
				bind:value={$form.email}
			/>
			{#if $errors.email}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-destructive" />
				</div>
			{/if}
		</div>
		{#if $errors.email}
			<p class="mt-2 text-sm text-destructive" id="email-error">{$errors.email}</p>
		{/if}
	</div>

	<div>
		<Label for="message">Message</Label>

		<div class="mt-2">
			<Textarea
				id="message"
				name="message"
				placeholder="Your message goes here :)"
				autocomplete="current-message"
				required
				class="block w-full input"
				aria-invalid={$form.message ? 'true' : undefined}
				aria-describedby={$errors.message ? 'email-error' : undefined}
				bind:value={$form.message}
			/>
			{#if $errors.message}
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<AlertCircle class="h-5 w-5 text-destructive" />
				</div>
			{/if}
		</div>
		{#if $errors.message}
			<p class="mt-2 text-sm text-destructive" id="email-error">{$errors.message}</p>
		{/if}
		<p class="mt-3 text-sm leading-6">Please tell us a little about your business.</p>
	</div>
	<div>
		<Button type="submit" class="flex w-full"
			>{#if $delayed}<Spinner /> &nbsp; Send{:else}
				Send
			{/if}</Button
		>
	</div>
</form>
