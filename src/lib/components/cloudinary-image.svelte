<script lang="ts">
	import { CldImage } from 'svelte-cloudinary';
	import { cn } from '$lib/utils';


	let className: string | null | undefined = undefined
	export { className as class };
	export let src = '';
	export let alt = '';
	export let height = '';
	export let width = '';
    export let aspectRatio = 1.0;
	export let sizes = ``;
	export let eager = false;
	export let crop: string = '';
</script>

<CldImage
	{src}
	{alt}
	{height}
	{width}
	{sizes}
	{crop}
    {aspectRatio}
	class={cn('', className)}
	loading={eager ? 'eager' : 'lazy'}
/>
