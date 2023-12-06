<script lang="ts">
	import type { User } from '$lib/types/user';
	import Avatar from './elements/Avatar.svelte';
	import { UserIcon } from 'lucide-svelte';
	import { createDropdownMenu, createAvatar } from '@melt-ui/svelte';
	import { goto } from '$app/navigation';

	export let user: User;

	// Grab first letter of first and last name
	$: initials = user?.first_name[0] + user?.last_name[0] || '';
	let src = '';
	let alt = user?.first_name + ' ' + user?.last_name + ' ' || 'Avatar';
	let delayMs = 250;

	const {
		elements: { trigger, menu, item }
	} = createDropdownMenu({
		positioning: { placement: 'bottom-end' },
		arrowSize: 0,
		preventScroll: false
	});

	// Melt Avatar
	// https://www.melt-ui.com/docs/builders/avatar
	const {
		elements: { image, fallback }
	} = createAvatar({
		src: src,
		delayMs: delayMs
	});

	const logout = async () => {
		console.log('logout');
		const formData = new FormData(); // The POST request fails without a body
		const res = await fetch('/auth/login?/logout', { method: 'POST', body: formData });
		if (res.ok) goto('/auth/login');
	};
</script>

{#if user}
	<button
		type="button"
		{...$trigger}
		use:trigger
		aria-label="Open account menu"
		class="group -m-2 flex items-center h-12 w-auto {src
			? 'p-1'
			: 'p-2'} bg-white hover:bg-black text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thunderbird-500 rounded-md transition-colors duration-150 ease-in"
	>
		<span class="sr-only">View account</span>
		<!-- <User class="h-6 w-6 flex-shrink-0" /> -->
		<Avatar {src} {alt} {initials} />
	</button>
{:else}
	<a href="/auth/login">
		<button
			type="button"
			class="group -m-2 flex items-center p-2 bg-white hover:bg-black text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thunderbird-500 rounded-md transition-colors duration-150 ease-in"
		>
			<span class="sr-only">Sign In</span>
			<UserIcon class="h-6 w-6 flex-shrink-0" />
		</button>
	</a>
{/if}
<div
	{...$menu}
	use:menu
	class="absolute right-0 z-10 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
>
	<a href="/account">
		<div {...$item} use:item class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
			Your Account
		</div>
	</a>
	<a href="/settings">
		<div {...$item} use:item class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
			Settings
		</div>
	</a>
	<button
		{...$item}
		on:m-click={logout}
		use:item
		class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
	>
		Sign Out
	</button>
</div>
