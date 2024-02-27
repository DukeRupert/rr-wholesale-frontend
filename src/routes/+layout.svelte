<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Toaster from '$lib/components/toast/index.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import * as Dialog from '$lib/components/ui/dialog';
	import { processing } from '$lib/stores';
	import { LucideLoader } from 'lucide-svelte';

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

<!-- light/dark mode -->
<ModeWatcher />
<!-- processing dialog -->
<Dialog.Root bind:open={$processing}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Processing request...</Dialog.Title>
			<Dialog.Description>
				<LucideLoader class="mt-6 h-8 w-8 mx-auto animate-spin" />
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
<Toaster />
{#if naked}
	<slot />
{:else}
	<NavBar bind:user bind:cart bind:count />
	<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
		<slot />
	</main>
{/if}
