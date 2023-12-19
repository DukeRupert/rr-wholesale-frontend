<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Toaster from '$lib/components/toast/index.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	export let data: PageData;
	const nakedPaths = [
		'/auth/login',
		'/auth/contact-sales',
		'/auth/forgot-password',
		'/auth/reset-password',
		'/checkout',
		'/dev',
		'/sitemap.xml'
	];
	$: naked = nakedPaths.includes($page.url.pathname);
	$: user = data?.user;
	$: cart = data?.cart;
	$: count = cart?.items?.length || null;

	function handleTest(e: any) {
		console.log("success")
	}
</script>

<Toaster />
{#if naked}
	<slot />
{:else}
	<NavBar bind:user bind:cart bind:count />
	<main on:test={handleTest} class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
		<slot />
	</main>
{/if}
