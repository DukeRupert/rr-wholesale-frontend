<script lang="ts">
	import ContactForm from './ContactForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="dark:bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-14 w-auto dark:invert"
			src="https://rockabillyroasting.com/wp-content/uploads/2020/04/SmallRRCBadge.png"
			alt="Rockabilly Roasting Co."
		/>
		<h2
			class="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
		>
			Contact Sales	
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<ContactForm data={data.form} />

		<p class="mt-10 text-center text-sm text-gray-400">
			Made a mistake?
			<a href="#" class="font-semibold leading-6">Return to login.</a>
		</p>
	</div>
</div>
