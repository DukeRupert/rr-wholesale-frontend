<script lang="ts">
	import type { PageData } from './$types';
	import ProductList from './(components)/product-list.svelte';

	export let data: PageData;
</script>

<div class="max-w-xl">
	<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Wholesale Products</h1>
	<p class="mt-1 text-sm text-muted-foreground">
		Please add the products you want to order to your cart and checkout.
	</p>
</div>
{#if data?.products}
	<ProductList products={data.products} />
{:else}
	<p class="mt-6">
		An error occured. Please <a href="mailto:logan@fireflysoftware.dev">contact</a> our technical support
		team.
	</p>
{/if}
