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

<div class="block space-y-6 p-10 pb-16">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
	</div>
	<Separator class="my-6" />
	<div class="grid grid-cols-5 gap-y-8">
		<aside class="col-span-5 lg:col-span-1 lg:px-4">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="col-span-5 lg:col-span-4 lg:px-4">
			<slot />
		</div>
	</div>
</div>
