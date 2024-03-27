<script lang="ts" context="module">
	// Generate breadcrumbs
	export interface BreadcrumbItem {
		label: string;
		url: string;
	}

	export function generateBreadcrumbs(segments: string[]): BreadcrumbItem[] {
		const breadcrumbs: BreadcrumbItem[] = [];

		let path = '';
		for (const segment of segments) {
			path += '/' + encodeURIComponent(segment);

			breadcrumbs.push({
				label: segment,
				url: path
			});
		}

		return breadcrumbs;
	}
</script>

<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	export let segments: string[];
	$: crumbs = generateBreadcrumbs(segments);
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link class="capitalize" href="/">home</Breadcrumb.Link>
		</Breadcrumb.Item>
		{#each crumbs as { url, label }, i}
			{#if i < crumbs.length - 1}
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link class="capitalize" href={url}>{label}</Breadcrumb.Link>
				</Breadcrumb.Item>
			{:else}
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize">{label}</Breadcrumb.Page>
				</Breadcrumb.Item>
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
