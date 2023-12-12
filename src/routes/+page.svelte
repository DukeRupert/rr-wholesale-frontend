<script lang="ts">
	import type { PageData } from './$types';
	import ProductList from '$lib/components/ProductList.svelte';
	export let data: PageData;
</script>

<div class="mt-8">
	<div class="max-w-xl">
		<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Wholesale Products</h1>
		<p class="mt-1 text-sm text-gray-500">
			Please add the products you want to order to your cart and checkout.
		</p>
	</div>
	<ProductList products={data.products} />
</div>
