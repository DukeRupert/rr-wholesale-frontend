<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog';
	import { processing } from '$lib/stores';
	import { LucideLoader } from 'lucide-svelte';
</script>

<!-- Display when performing async operations -->
<Dialog.Root bind:open={$processing}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Processing request...</Dialog.Title>
			<Dialog.Description>
				<LucideLoader class="mt-6 h-8 w-8 mx-auto animate-spin" />
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>