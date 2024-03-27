<script lang="ts" context="module">
    import type { PricedVariant } from '@medusajs/medusa/dist/types/pricing'

	interface Option {
		id: string;
		option_id: string;
		value: string;
		// ... other properties
	}

	function getMatchingOptions(variants: PricedVariant[], option_id: string): Option[] {
		const matchingOptions: Option[] = [];
        // if(!variants || !variants?.options) return matchingOptions;

		for (const variant of variants) {
			for (const option of variant.options) {
				if (option.option_id === option_id) {
					matchingOptions.push(option);
				}
			}
		}

		return matchingOptions;
	}
</script>

<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { CldImage } from 'svelte-cloudinary';
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	export let data: PageData;
	let { product, segments } = data;
	console.log(product);

	// Client API:
	const form = superForm(data.form, {});

	const { form: formData, enhance } = form;

	const fallback_image =
		'https://res.cloudinary.com/rr-wholesale/image/upload/v1710875912/RockabillyRoasting/cropped-RockabillyLogo_m8iqgy.png';
</script>

<div class="mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8">
	<!-- Product details -->
	<div class="lg:max-w-lg lg:self-end">
		<Breadcrumbs {segments} />

		<div class="mt-4">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				{product.title}
			</h1>
		</div>

		<section aria-labelledby="information-heading" class="mt-4">
			<h2 id="information-heading" class="sr-only">Product information</h2>

			<div class="mt-4 space-y-6">
				<p class="text-base text-gray-500">
					{product.description}
				</p>
			</div>
		</section>
	</div>

	<!-- Product image -->
	<div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
		<div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
			<CldImage
				src={product?.thumbnail ?? fallback_image}
				alt={product?.title}
				height="672"
				width="672"
				crop="fit"
				sizes="(max-width: 768px) 80vw, 50vw"
				class="h-full w-full object-cover object-center"
			/>
		</div>
	</div>

	<!-- Product form -->
	<div class="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
		<section aria-labelledby="options-heading">
			<h2 id="options-heading" class="sr-only">Product options</h2>

			<form method="POST" use:enhance>
				<div class="sm:flex sm:justify-between">
					{#if product?.options && product.options.length > 0}
						{#each product.options as option}
							<Form.Field {form} name={option.title}>
								<Form.Control let:attrs>
									<Form.Label>{option.title}</Form.Label>
									<Select.Root
										onSelectedChange={(v) => {
											v && ($formData[option.title] = v.value);
										}}
									>
										<Select.Trigger {...attrs}>
											<Select.Value placeholder={`Select a ${option.title}`} />
										</Select.Trigger>
										<Select.Content>
											{#each getMatchingOptions(product.variants, option.id) as o}
												<Select.Item value={o.id} label={o.value} />
											{/each}
										</Select.Content>
									</Select.Root>
									<input hidden bind:value={$formData.email} name={attrs.name} />
								</Form.Control>
								<Form.Description>
									You can manage email address in your <a href="/examples/forms">email settings</a>.
								</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
							<!-- <Select.Root>
								<Select.Trigger class="w-full">
									<Select.Value placeholder="Theme" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="light">Light</Select.Item>
									<Select.Item value="dark">Dark</Select.Item>
									<Select.Item value="system">System</Select.Item>
								</Select.Content>
							</Select.Root> -->
						{/each}
					{/if}
				</div>

				<div class="mt-10">
					<button
						type="submit"
						class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
						>Add to bag</button
					>
				</div>
				<div class="mt-6 text-center">
					<a href="#" class="group inline-flex text-base font-medium">
						<svg
							class="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
							/>
						</svg>
						<span class="text-gray-500 hover:text-gray-700">Lifetime Guarantee</span>
					</a>
				</div>
			</form>
			{#if browser}
				<SuperDebug data={$formData} />
			{/if}
		</section>
	</div>
</div>
