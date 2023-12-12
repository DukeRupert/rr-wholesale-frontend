<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Toaster from '$lib/components/toast/index.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	export let data: PageData;
	const nakedPaths = [
		'/auth/login',
		'/auth/register',
		'/auth/forgot-password',
		'/auth/reset-password',
		'/checkout',
		'/sitemap.xml'
	];
	$: naked = nakedPaths.includes($page.url.pathname);
	$: user = data?.user;
	$: cart = data?.cart;
	$: count = cart?.items?.length || null;
</script>

<Toaster />
{#if naked}
	<slot />
{:else}
	<NavBar bind:user bind:cart bind:count />
	<!-- <Navigation bind:user bind:cart bind:count /> -->
	<main class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<slot />
	</main>
{/if}
