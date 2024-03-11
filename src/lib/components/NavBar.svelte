<script lang="ts">
	import { company } from '$lib/constants';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Menu } from 'lucide-svelte';
	import LightSwitch from './LightSwitch.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Cart from './Cart.svelte';
	import Account from './Account.svelte';
	import type { ExtendedCustomer } from '$lib/types/app';
	import type { Cart as MedusaCart } from "@medusajs/medusa/dist/models/cart"
	import { is_cart_open } from '$lib/stores';

	export let user: ExtendedCustomer | null;
	export let cart: Omit<MedusaCart, "refundable_amount" | "refunded_total"> | null;
	export let count: number | null;

	let is_open = false;

	// Control whether the banner is displayed
	const banner = {
		is_live: false,
		message: 'Free delivery on orders over $100'
	};

	const links = [
		{ label: 'Shop', href: '/' },
		{ label: 'Orders', href: '/orders' },
		{ label: 'Account', href: '/account' }
	];

	// For highlighting current path
	$: path = $page.route.id;

	const logout = async () => {
		const formData = new FormData(); // The POST request fails without a body
		const res = await fetch('/auth?/logout', { method: 'POST', body: formData });
		if (res.ok) goto('/auth');
	};

	// Close the mobile menu when navigation
	$: if ($navigating) $is_cart_open = false;
</script>

<nav class="">
	<Collapsible.Root bind:open={is_open} class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- <div use:melt={$root} class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> -->
		<div class="flex h-16 lg:h-24 justify-between">
			<div class="flex">
				<div class="flex flex-shrink-0 items-center">
					<a
						href="/"
						class="rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-thunderbird-500"
					>
						<span class="sr-only">{company.name}</span>
						<img
							class="h-12 lg:h-16 w-auto dark:invert"
							src={company.logo.src}
							alt={company.logo.alt}
						/>
					</a>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
					{#each links as { label, href }}
						<a
							{href}
							class="inline-flex h-10 items-center {path === href
								? 'border-b-2 border-accent'
								: '0'} px-1 pt-1 text-sm font-medium">{label}</a
						>
					{/each}
				</div>
			</div>
			<div class="ml-6 flex items-center space-x-6">
				<div>
					<LightSwitch />
				</div>
				<!-- Profile dropdown -->
				<div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-6">
					{#if user}
						<Account {user} />
					{/if}
				</div>
				<!-- Cart menu -->
				<div class="flex items-center">
					<div class="relative">
						<Cart bind:cart bind:count />
					</div>
				</div>
				<!-- Mobile menu button -->
				<div class="-mr-2 flex items-center space-x-6 sm:hidden">
					<Collapsible.Trigger
						asChild
						let:builder
						aria-controls="mobile-menu"
						aria-expanded={is_open}
					>
						<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
							<span class="sr-only">Open main menu</span>

							<Menu class="block h-6 w-6" />
						</Button></Collapsible.Trigger
					>
				</div>
			</div>
		</div>
		<!-- Mobile menu, show/hide based on menu state. -->
		<Collapsible.Content id="mobile-menu">
			<div class="space-y-1 pb-3 pt-2">
				{#each links as { label, href }}
					<a
						{href}
						class="block border-l-4 {path === href
							? 'border-accent'
							: 'border-transparent'} py-2 pl-3 pr-4 text-base font-medium">{label}</a
					>
				{/each}
			</div>
			<div class="border-t pb-3 pt-4">
				<div class="mt-3 space-y-1">
					<a href="/settings" class="block px-4 py-2 text-base font-medium">Settings</a>
					<button
						on:click={() => logout()}
						class="block w-full px-4 py-2 text-start text-base font-medium">Sign out</button
					>
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</nav>
