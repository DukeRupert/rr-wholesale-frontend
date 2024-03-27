<script lang="ts" context="module">
	import type { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
	import { z } from 'zod';

	export const baseSchema = z.object({
		variant_id: z.string().default(''),
		quantity: z.number().default(1)
	});

	interface Option {
		id: string;
		option_id: string;
		value: string;
		// ... other properties
	}

	function getMatchingOptions(variants: PricedVariant[], option_id: string): Option[] {
		const matchingOptions: Option[] = [];

		for (const variant of variants) {
			//@ts-ignore
			for (const option of variant.options) {
				if (option.option_id === option_id) {
					if (matchingOptions.findIndex((val) => val.value === option.value) === -1)
						matchingOptions.push(option);
				}
			}
		}

		return matchingOptions;
	}

	function hasTruthyValuesForKeys(obj: Record<string, string>, keys: string[]): boolean {
		return keys.every((key) => obj.hasOwnProperty(key) && !!obj[key]);
	}

	function filterOutVariantsWithoutOptionId(
		variants: PricedVariant[],
		id: string
	): PricedVariant[] {
		return variants.filter((variant) => variant?.options.some((option) => option.value === id));
	}

	function filterVariantsByMultipleOptions(
		variants: PricedVariant[],
		optionIds: string[]
	): PricedVariant[] {
		let filteredVariants = variants; // Start with all variants

		for (const optionId of optionIds) {
			console.log(`filtering varaints by option_id: ${optionId}`);
			filteredVariants = filterOutVariantsWithoutOptionId(filteredVariants, optionId);
			console.log(filteredVariants);
		}

		return filteredVariants;
	}
</script>

<script lang="ts">
	import type { PageData } from './$types';
	import { Loader } from 'lucide-svelte';
	import { CldImage } from 'svelte-cloudinary';
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { handle_toast } from '$lib/utilities';
	import { tick } from 'svelte';

	export let data: PageData;
	let { product, segments } = data;
	let { variants, options } = product;
	let option_keys = options?.map((el) => el.title) ?? [];

	// Client API:
	const form = superForm(data.form, {
		validators: zodClient(baseSchema),
		onChange(event) {
			if (event.target) {
				// Form input event
				console.log(event.path, 'was changed with', event.target, 'in form', event.formElement);
			} else {
				// Programmatic event
				console.log('Fields updated:', event.paths);
				if (hasTruthyValuesForKeys($formData, option_keys)) {
					const opts = option_keys.map((o) => $formData[o]);
					const [v] = filterVariantsByMultipleOptions(variants, opts);
					if (v && v.id) $formData.variant_id = v.id;
				}
			}
		},
		onUpdated: async ({ form }) => {
			if (form.message) {
				handle_toast(form.message);
				return;
			}
			await tick();
		}
	});

	const { form: formData, submitting, enhance } = form;

	const fallback_image =
		'https://res.cloudinary.com/rr-wholesale/image/upload/v1710875912/RockabillyRoasting/cropped-RockabillyLogo_m8iqgy.png';
</script>

<div class="mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8">
	<!-- Product details -->
	<div class="lg:max-w-lg lg:self-end">
		<Breadcrumbs {segments} />

		<div class="mt-4">
			<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
				{product.title}
			</h1>
		</div>

		<section aria-labelledby="information-heading" class="mt-4">
			<h2 id="information-heading" class="sr-only">Product information</h2>

			<div class="mt-4 space-y-6">
				<p class="text-base text-muted-foreground">
					{product?.description ?? ''}
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
				<div class="sm:flex sm:justify-between lg:flex-col lg:space-y-4">
					{#if options && options.length > 0}
						{#each options as option}
							<Form.Field {form} name={option.title} class="mb-4 lg:mb-0">
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
											{#each getMatchingOptions(variants, option.id) as o}
												<Select.Item value={o.value} label={o.value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
							</Form.Field>
						{/each}
					{/if}
					<Form.Field {form} name="quantity">
						<Form.Control let:attrs>
							<Form.Label>Quantity</Form.Label>
							<Input {...attrs} bind:value={$formData.quantity} />
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="variant_id">
					<Form.Control let:attrs>
						<Input {...attrs} type="text" bind:value={$formData.variant_id} class="hidden" />
					</Form.Control>
				</Form.Field>
				<div class="mt-10">
					<Form.Button
						type="submit"
						variant="default"
						disabled={!(!!$formData.variant_id && !!$formData.quantity) || $submitting}
						class="w-full"
					>
						{#if $submitting}
							<Loader class="h-5 w-5 animate-spin" />
						{:else}
							Add to cart
						{/if}</Form.Button
					>
				</div>
			</form>
		</section>
	</div>
</div>
