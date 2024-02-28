<script lang="ts">
	import type { PageData } from "./$types";
	import AddressForm from "./address-form.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	export let data: PageData;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Address Book</h3>
		<p class="text-sm text-muted-foreground">Save addresses to speed up your checkout flow.</p>
	</div>
	<Separator />
	<AddressForm data={data.form} />
</div>