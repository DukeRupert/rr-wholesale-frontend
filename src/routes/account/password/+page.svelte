<script lang="ts">
	import type { PageData } from "./$types";
	import PasswordForm from "./password-form.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	export let data: PageData;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Update Password</h3>
		<p class="text-sm text-muted-foreground">Using a password manager is highly encouraged.</p>
	</div>
	<Separator />
	<PasswordForm data={data.form} />
</div>