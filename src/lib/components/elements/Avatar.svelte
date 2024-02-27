<!--
 @component
 An image element with a fallback for representing the user.
 #### Props
 - **src**: string - The URL of the image to display.
 - **alt**: string - The alt text for the image. Defaults to 'Avatar'.
 - **delayMs**: number - The delay in milliseconds before the image is displayed. Defaults to 0.
 - **initials**: string - The initials to display if the image fails to load.
 - **bg**: string - The background color to use for the fallback. Defaults to 'bg-neutral-200'.
 - **size**: number - The size of the avatar in 0.25rem increments. Defaults to 12.
-->

<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { User } from 'lucide-svelte';
	import { createAvatar, melt } from '@melt-ui/svelte';

	export let src: string = '';
	export let alt: string = 'Avatar';
	export let delayMs: number = 0;
	export let initials: string = '';

	// Melt Avatar
	// https://www.melt-ui.com/docs/builders/avatar
	const {
		elements: { image, fallback }
	} = createAvatar({
		src: src,
		delayMs: delayMs
	});
</script>

<Avatar.Root>
  <Avatar.Image {src} {alt} />
  <Avatar.Fallback>{initials}</Avatar.Fallback>
</Avatar.Root>

<!-- <img class="h-full w-full rounded-full" use:melt={$image} {alt} />
{#if initials}
<span use:melt={$fallback} >{initials}</span>
{:else}
<User class="h-6 w-6 flex-shrink-0" />
{/if} -->