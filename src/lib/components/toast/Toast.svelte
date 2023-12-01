<script lang="ts">
    import type { ToastData } from './index.svelte';
    import type { Toast, ToastsElements } from '@melt-ui/svelte';
	import Warning from './Warning.svelte';
	import Success from './Success.svelte';
	import Error from './Error.svelte';

    export let elements: ToastsElements;
    export let toast: Toast<ToastData>;
        $: ({ data, id } = toast);

	let toastOptions = [
		{ type: 'success', component: Success },
		{ type: 'warning', component: Warning },
		{ type: 'error', component: Error }
	];

	let component = toastOptions.find((t) => t.type === toast.data.type)!.component;
</script>

<svelte:component this={component} {elements} {toast} />