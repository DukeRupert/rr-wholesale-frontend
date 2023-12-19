<script lang="ts">
	import ContactForm from './ContactForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Handle success
	let success = false;
	let first = '';
	let last = '';

	const handleSuccess = (e: CustomEvent<{ f: string; l: string }>): void => {
		const { f, l } = e.detail;
		first = f;
		last = l;
		success = true;
	};
</script>

{#if success}
	<main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
		<div class="text-center">
			<p class="text-base font-semibold text-thunderbird-600">Thank you</p>
			<h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
				{first}
				{last}
			</h1>
			<p class="mt-6 text-base leading-7 text-gray-600">We will contact you soon.</p>
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<a href="/" class="btn">Go back home</a>
			</div>
		</div>
	</main>
{:else}
	<div class="dark:bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img
				class="mx-auto h-20 w-auto dark:invert"
				src="https://rockabillyroasting.com/wp-content/uploads/2020/04/SmallRRCBadge.png"
				alt="Rockabilly Roasting Co."
			/>
			<h2
				class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
			>
				Contact Sales
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<ContactForm on:success={handleSuccess} data={data.form} />

			<p class="mt-10 text-center text-sm text-gray-400">
				Made a mistake?
				<a href="/auth/login" class="font-semibold leading-6">Return to login.</a>
			</p>
		</div>
	</div>
{/if}
