<script lang="ts">
	import ContactForm from './contact-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
	Contact our sales team
</h2>
<div class="mt-10">
	<ContactForm data={data.form} />

	<p class="mt-10 text-center text-sm">
		Clicked the wrong button?
		<a href="/auth" class="underline underline-offset-4 hover:text-primary">Return home</a>
	</p>
</div>
