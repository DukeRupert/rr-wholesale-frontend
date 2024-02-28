<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	// import Toaster from '$lib/components/toast/index.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import LoadingDialogue from '$lib/components/LoadingDialogue.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

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
</script>

<!-- enable light/dark mode -->
<ModeWatcher />
<!-- visual indicator that background tasks are in progress -->
<LoadingDialogue />
<!-- a simple toast -->
<Toaster richColors />
{#if naked}
	<slot />
{:else}
	<NavBar bind:user bind:cart bind:count />
	<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
		<slot />
	</main>
{/if}
