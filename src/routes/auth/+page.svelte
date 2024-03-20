<script lang="ts">
	import LoginForm from './login-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let return_url: string;
</script>

<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
	Sign in to your account
</h2>
<div class="mt-10">
	<LoginForm data={data.form} {return_url} />

	<p class="mt-10 text-center text-sm">
		Forgot your password?
		<a href="/auth/forgot-password" class="underline underline-offset-4 hover:text-primary"
			>Request a reset.</a
		>
	</p>
	<p class="mt-4 text-center text-sm">
		Not a member?
		<a href="/auth/contact-sales" class="underline underline-offset-4 hover:text-primary"
			>Contact our sales team.</a
		>
	</p>
</div>
