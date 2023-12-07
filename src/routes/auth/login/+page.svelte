<script lang="ts">
	import LoginForm from './LoginForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="dark:bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-20 w-auto dark:invert"
			src="https://rockabillyroasting.com/wp-content/uploads/2020/04/SmallRRCBadge.png"
			alt="Rockabilly Roasting Co."
		/>
		<h2
			class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
		>
			Sign in to your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<LoginForm data={data.form} rurl={data.rurl} />

		<p class="mt-10 text-center text-sm text-gray-400">
			Not a member?
			<a href="#" class="font-semibold leading-6">Contact our sales team.</a>
		</p>
	</div>
</div>
