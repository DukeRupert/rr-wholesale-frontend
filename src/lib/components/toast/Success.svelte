<script lang="ts">
	import type { ToastData } from './index.svelte';
	import { melt, type Toast, type ToastsElements } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import { X, CheckCircle2 } from 'lucide-svelte';

	export let elements: ToastsElements;
	$: ({ content, title, description, close } = elements);

	export let toast: Toast<ToastData>;
	$: ({ data, id } = toast);
</script>

<div
	use:melt={$content(id)}
	in:fly={{ duration: 150, x: '100%' }}
	out:fly={{ duration: 300, x: '100%' }}
	class="border-l-4 border-green-400 bg-green-50 p-4 min-w-[400px]"
>
	<div class="flex">
		<div class="flex-shrink-0">
			<CheckCircle2 class="h-5 w-5 text-white fill-green-400" />
		</div>
		<div class="ml-3">
			<h3 use:melt={$title(id)} class="text-sm font-medium capitalize text-green-800">{data.title}</h3>
			<div class="mt-2 text-sm text-green-700">
				<p use:melt={$description(id)}>
					{data.description}
				</p>
			</div>
		</div>
		<div class="ml-auto pl-3">
			<div class="-mx-1.5 -my-1.5">
				<button
					use:melt={$close(id)}
					type="button"
					class="inline-flex rounded-md bg-gray-50 p-1.5 text-green-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-50"
				>
					<span class="sr-only">Dismiss</span>
					<X class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</div>