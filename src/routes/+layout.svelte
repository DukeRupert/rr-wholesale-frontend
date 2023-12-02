<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Toaster from '$lib/components/toast/index.svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	export let data: PageData;
	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml'];
	$: naked = nakedPaths.includes($page.url.pathname);
	$: user = data?.user;
	$: cart = data?.cart;
	$: count = cart?.items?.length || null;
</script>

<Toaster />
{#if naked}
	<slot />
{:else}
	<Navigation bind:user bind:cart bind:count />
	<slot />
{/if}
