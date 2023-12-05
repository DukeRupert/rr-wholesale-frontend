<script lang="ts">
	import Avatar from './elements/Avatar.svelte';
	import { User } from 'lucide-svelte';
	import { createDropdownMenu, createAvatar } from '@melt-ui/svelte';
	import { goto } from '$app/navigation';
	export let user: User | null = null;
	
	// Grab first letter of first and last name
	$: initials = user?.first_name[0] + user?.last_name[0] || '';
	let src = ''
	let alt = user?.first_name + " " + user?.last_name + " " || 'Avatar';
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
		class="group -m-2 flex items-center h-12 w-auto {src ? "p-1" : "p-2"} bg-white hover:bg-black text-gray-400 hover:text-white rounded-md transition-colors duration-150 ease-in"
	>
		<span class="sr-only">View account</span>
		<!-- <User class="h-6 w-6 flex-shrink-0" /> -->
		<Avatar {src} {initials} />
	</button>
{:else}
	<a href="/auth/login">
		<button
			type="button"
			class="group -m-2 flex items-center p-2 bg-white hover:bg-black text-gray-400 hover:text-white rounded-md transition-colors duration-150 ease-in"
		>
			<span class="sr-only">Sign In</span>
			<User class="h-6 w-6 flex-shrink-0" />
		</button>
	</a>
{/if}
<div {...$menu} use:menu class="menu">
	<div {...$item} use:item class="item">
		<a href="/account">Your Profile</a>
	</div>
	<div {...$item} use:item class="item">
		<button type="button" on:click={logout}>Sign Out</button>
	</div>
</div>

<style lang="postcss">
	.menu {
		@apply z-10 flex flex-col shadow-lg;
		@apply rounded-lg bg-white p-1 shadow-neutral-900/30;
		@apply ring-0 !important;
	}
	.item {
		@apply relative h-6 min-h-[24px] select-none rounded-md px-8 py-6;
		@apply z-20 text-gray-900 outline-none;
		@apply data-[highlighted]:bg-stone-200 data-[highlighted]:text-purple-900;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		@apply text-purple-900 transition-colors hover:bg-white/90;
		@apply data-[highlighted]:ring-purple-400 data-[highlighted]:ring-offset-2 !important;
		@apply p-0 text-sm font-medium focus:ring data-[highlighted]:outline-none;
	}
</style>
