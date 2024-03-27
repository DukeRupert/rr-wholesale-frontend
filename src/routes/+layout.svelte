<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import NavBar from '$lib/components/nav/navbar.svelte';
	import LoadingDialogue from '$lib/components/loading-dialogue.svelte';
	export let data: PageData;
	const nakedPaths = [
		'/auth',
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
