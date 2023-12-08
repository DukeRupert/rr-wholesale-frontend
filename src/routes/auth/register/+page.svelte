<script lang="ts">
	import RegisterForm from './RegisterForm.svelte';
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
			Register a new account	
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<RegisterForm data={data.form} rurl={data.rurl} />

		<p class="mt-10 text-center text-sm text-gray-400">
			Already have an account?
			<a href="/auth/login" class="font-semibold leading-6">Login</a>
		</p>
	</div>
</div>
