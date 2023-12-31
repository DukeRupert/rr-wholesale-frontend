<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { resetPostReq } from '$lib/validators/auth';
	import { AlertCircle } from 'lucide-svelte';

	export let data: PageData;

	const { form, errors, tainted, message, enhance } = superForm(data.form, {
		validators: resetPostReq,
		invalidateAll: true,
		taintedMessage: null
	});

	$form.rurl = data.rurl || '';
</script>

<div class="dark:bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-20 w-auto dark:invert"
			src="https://rockabillyroasting.com/wp-content/uploads/2020/04/SmallRRCBadge.png"
			alt="Rockabilly Roasting Co."
		/>
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
			Sign in to your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form use:enhance action="?/login" method="POST" class="space-y-6">
			<input type="hidden" name="rurl" value={$form.rurl} />
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
					>Email address</label
				>
				<div class="relative mt-2 rounded-md shadow-sm">
					<input
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
							<AlertCircle class="h-5 w-5 text-red-500" />
						</div>
					{/if}
				</div>
				{#if $errors.email}
					<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.email}</p>
				{/if}
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
						>Password</label
					>
				</div>
				<div class="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="new-password"
						required
						class="block w-full input"
						aria-invalid={$form.password? 'true' : undefined}
						aria-describedby={$errors.password ? 'email-error' : undefined}
						bind:value={$form.password}
					/>
					{#if $errors.password}
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<AlertCircle class="h-5 w-5 text-red-500" />
						</div>
					{/if}
				</div>
				{#if $errors.password}
					<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.password}</p>
				{/if}
			</div>

            <div>
				<div class="flex items-center justify-between">
					<label for="passwordConfirm" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
						>Confirm Password</label
					>
				</div>
				<div class="mt-2">
					<input
						id="passwordConfirm"
						name="passwordConfirm"
						type="passwordConfirm"
                        autocomplete="new-password"
						required
						class="block w-full input"
						aria-invalid={$form.passwordConfirm? 'true' : undefined}
						aria-describedby={$errors.passwordConfirm ? 'email-error' : undefined}
						bind:value={$form.passwordConfirm}
					/>
					{#if $errors.passwordConfirm}
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<AlertCircle class="h-5 w-5 text-red-500" />
						</div>
					{/if}
				</div>
				{#if $errors.passwordConfirm}
					<p class="mt-2 text-sm text-red-600" id="email-error">{$errors.passwordConfirm}</p>
				{/if}
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full btn"
					>Sign in</button
				>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-400">
			Not a member?
			<a href="#" class="font-semibold leading-6"
				>Contact our sales team.</a
			>
		</p>
	</div>
</div>