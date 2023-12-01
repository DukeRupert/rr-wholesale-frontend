<!--
 @component
 A succinct message that is displayed temporarily.
 #### Use
 This component should be added to your root +layout.svelte or App.svelte component.
 Use the exported addToast helper function to add a toast from any component of the application.

 ```
 import { addToast } from '$lib/Toaster.svelte'

 function create() {
    addToast({
      data: {
        type: 'success' | 'warning' | 'error',
        title: 'Success',
        description: 'The resource was created!',
      }
    })
  }
  ```
-->

<script lang="ts" context="module">
	export type ToastData = {
		type: 'success' | 'warning' | 'error';
		title: string;
		description: string;
	};

	const {
		elements,
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export const addToast = helpers.addToast;
</script>

<script lang="ts">
	import { createToaster } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
</script>

<div
	class="fixed right-0 bottom-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
	use:portal
>
	{#each $toasts as toast (toast.id)}
		<div animate:flip={{ duration: 500 }}>
			<Toast {elements} {toast} />
		</div>
	{/each}
</div>