<script lang="ts">
	import { company } from '$lib/constants';
	import Cart from './Cart.svelte';
	import Account from './Account.svelte';
	import SideBar from './Sidebar.svelte';
	export let user: {};
	export let cart: {};
	export let count: number;

	// Control whether the banner is displayed
	const banner = {
		is_live: true,
		message: 'Free delivery on orders over $100'
	};
</script>

<header class="relative">
	<nav aria-label="Top">
		{#if banner.is_live}
			<!-- Banner -->
			<div class="bg-gray-900">
				<div class="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<!-- Currency selector -->
					<div class="hidden lg:block lg:flex-1">
						<p class="invisible">Placeholder for currency selector</p>
					</div>

					<p class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
						Get free delivery on orders over $100
					</p>

					<div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
						<a href="#" class="text-sm font-medium text-white hover:text-gray-100"
							>Create an account</a
						>
						<span class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
						<a href="#" class="text-sm font-medium text-white hover:text-gray-100">Sign in</a>
					</div>
				</div>
			</div>
		{/if}
		<!-- Secondary navigation -->
		<div class="bg-white">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="border-b border-gray-200">
					<div class="flex h-20 items-center justify-between">
						<!-- Logo (lg+) -->
						<div class="hidden lg:flex lg:items-center">
							<a href="#" class="transform hover:scale-105 transition-all duration-150 ease-in-out">
								<span class="sr-only">Your Company</span>
								<img src={company.logo.src} alt={company.logo.alt} class="h-16 w-auto" />
							</a>
						</div>
						<div class="hidden h-full lg:flex">
							<!-- Mega menus -->
							<div class="ml-8">
								<div class="flex h-full justify-center space-x-8">
									<a
										href="/"
										class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
										>About Us</a
									>
								</div>
							</div>
						</div>

						<!-- Mobile menu -->
						<div class="flex flex-1 items-center lg:hidden">
							<SideBar {user} />
						</div>

						<!-- Logo (lg-) -->
						<a
							href="#"
							class="lg:hidden transform hover:scale-105 transition-all duration-150 ease-in-out"
						>
							<span class="sr-only">Your Company</span>
							<img src={company.logo.src} alt={company.logo.alt} class="h-16 w-auto" />
						</a>

						<div class="flex flex-1 items-center justify-end">
							<div class="flex items-center lg:ml-8">
								<div class="flex space-x-8">
									<div class="flex">
										<Account {user} />
									</div>
								</div>

								<span class="mx-4 h-6 w-px bg-gray-200 lg:mx-6" aria-hidden="true"></span>

								<Cart bind:cart bind:count />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</header>
