<script lang="ts">
	import type { PageData } from './$types';
	import ProductList from '$lib/components/ProductList.svelte';
	export let data: PageData;
</script>

<div class="mt-8">
	<ProductList products={data.products} />
</div>
