<script lang="ts">
	import type { ExtendedCustomer } from '$lib/types/app';
	import Avatar from './elements/Avatar.svelte';
	import { UserIcon } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { goto } from '$app/navigation';

	export let user: ExtendedCustomer;

	// Grab first letter of first and last name
	$: initials = user?.first_name[0] + user?.last_name[0] || '';
	let src = '';
	let alt = user?.first_name + ' ' + user?.last_name + ' ' || 'Avatar';

	const logout = async () => {
		console.log('logout');
		const formData = new FormData(); // The POST request fails without a body
		const res = await fetch('/auth/login?/logout', { method: 'POST', body: formData });
		if (res.ok) goto('/auth/login');
	};
</script>

<DropdownMenu.Root>
	{#if !user}
		<a href="/auth/login">
			<button
				type="button"
				class="group -m-2 flex items-center p-2 bg-white hover:bg-black text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thunderbird-500 rounded-md transition-colors duration-150 ease-in"
			>
				<span class="sr-only">Sign In</span>
				<UserIcon class="h-6 w-6 flex-shrink-0" />
			</button>
		</a>
	{:else}
		<DropdownMenu.Trigger
			><span class="sr-only">View account</span>

			<Avatar {src} {alt} {initials} />
		</DropdownMenu.Trigger>
	{/if}

	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Settings</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/account">Account</DropdownMenu.Item>
			<DropdownMenu.Item on:click={logout}>Sign out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>