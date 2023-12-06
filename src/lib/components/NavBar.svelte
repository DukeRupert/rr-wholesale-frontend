<script lang="ts">
	import { company } from '$lib/constants';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { X, Menu } from 'lucide-svelte';
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { slide, type SlideParams } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import Cart from './Cart.svelte';
	import Account from './Account.svelte';
	import SideBar from './Sidebar.svelte';
	import type { User } from '$lib/types/user';
	import type { Cart as ShoppingCart } from '$lib/types/cart';
	export let user: User | null;
	export let cart: ShoppingCart | null;
	export let count: number | null;

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

	// Dropdown menu
	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible();

	const slideParams: SlideParams = {
		duration: 300,
		easing: quadOut
	};

	const logout = async () => {
		console.log('logout');
		const formData = new FormData(); // The POST request fails without a body
		const res = await fetch('/auth/login?/logout', { method: 'POST', body: formData });
		if (res.ok) goto('/auth/login');
	};
</script>

<nav class="bg-white shadow">
	<div use:melt={$root} class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 lg:h-24 justify-between">
			<div class="flex">
				<div class="flex flex-shrink-0 items-center">
					<a
						href="/"
						class="rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-thunderbird-500"
					>
						<span class="sr-only">{company.name}</span>
						<img class="h-12 lg:h-20 w-auto" src={company.logo.src} alt={company.logo.alt} />
					</a>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					{#each links as { label, href }}
						<a
							{href}
							class="inline-flex items-center border-b-2 focus:outline-none focus:ring-2 focus:ring-inset-2 focus:ring-thunderbird-500 {path ===
							href
								? 'border-thunderbird-500 text-gray-900'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} px-1 pt-1 text-sm font-medium"
							>{label}</a
						>
					{/each}
				</div>
			</div>
			<div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-6">
				<!-- Profile dropdown -->
				{#if user}
					<Account {user} />
				{/if}
				<!-- Cart menu -->
				<div class="relative ml-3">
					<Cart bind:cart bind:count />
				</div>
			</div>
			<div class="-mr-2 flex items-center sm:hidden">
				<!-- Mobile menu button -->
				<button
					use:melt={$trigger}
					type="button"
					class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-thunderbird-500"
					aria-controls="mobile-menu"
					aria-expanded="false"
				>
					<span class="absolute -inset-0.5"></span>
					<span class="sr-only">Open main menu</span>

					<Menu class="block h-6 w-6" />
				</button>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		{#if $open}
			<div
				use:melt={$content}
				transition:slide={slideParams}
				class="sm:hidden bg-white"
				id="mobile-menu"
			>
				<div class="space-y-1 pb-3 pt-2">
					<!-- Current: "bg-thunderbird-50 border-thunderbird-500 text-thunderbird-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
					{#each links as { label, href }}
						<a
							{href}
							class="block border-l-4 {path === href
								? 'border-thunderbird-500 bg-thunderbird-50 text-thunderbird-700'
								: 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} py-2 pl-3 pr-4 text-base font-medium"
							>{label}</a
						>
					{/each}
				</div>
				<div class="border-t border-gray-200 pb-3 pt-4">
					<div class="mt-3 space-y-1">
						<a
							href="/settings"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
							>Settings</a
						>
						<button
							on:click={logout}
							class="block w-full px-4 py-2 text-start text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
							>Sign out</button
						>
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>
