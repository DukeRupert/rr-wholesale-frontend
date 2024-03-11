<script lang="ts">
	import SidebarNav from './(components)/sidebar-nav.svelte';
	import { Separator } from '$lib/components/ui/separator';

	const sidebarNavItems = [
		{
			title: 'Profile',
			href: '/account'
		},
		{
			title: 'Password',
			href: '/account/password'
		},
		{
			title: 'Address Book',
			href: '/account/address-book'
		}
	];
</script>

<div class="max-w-xl lg:max-w-none">
	<div class="space-y-0.5">
		<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
	</div>
	<Separator class="my-6" />
	<div class="pb-16 md:px-8 lg:px-12 grid grid-cols-5 gap-y-8">
		<aside class="col-span-5 lg:col-span-1 lg:px-4">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="col-span-5 lg:col-span-4 lg:px-4">
			<slot />
		</div>
	</div>
</div>
