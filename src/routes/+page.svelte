<script lang="ts">
	import type { PageData } from './$types';
	import ProductList from '$lib/components/ProductList.svelte';

	export let data: PageData;
	$: ({ products } = data);
	$: console.log(products)	
</script>

<div class="max-w-xl">
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Wholesale Products</h1>
	<p class="mt-1 text-sm text-gray-500">
		Please add the products you want to order to your cart and checkout.
	</p>
</div>
{#if products}
	<ProductList {products} />
{:else}
	<p class="mt-6">
		An error occured. Please <a href="mailto:logan@fireflysoftware.dev">contact</a> our technical support
		team.
	</p>
{/if}
