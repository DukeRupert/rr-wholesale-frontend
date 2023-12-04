<script lang="ts">
	import { SunIcon, MoonIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';
	let resolvedTheme: Theme = 'dark';
	let mounted = false;

	function resolveTheme(theme: Theme): Theme {
		if (theme === 'dark') return 'light';
		return 'dark';
	}

	function changeTheme(theme: Theme) {
		if (mounted) {
			document.documentElement.classList.remove(theme);
			resolvedTheme = resolveTheme(theme);
			localStorage.setItem('theme', resolvedTheme);
			document.documentElement.classList.add(resolvedTheme);
		}
	}

	function setTheme(theme: Theme) {
		resolvedTheme = theme;
		localStorage.setItem('theme', theme);
		const other = resolveTheme(theme);
		document.documentElement.classList.remove(other);
		const alreadyExists = document.documentElement.classList.contains(theme);
		if (!alreadyExists) {
			document.documentElement.classList.add(theme);
		}
	}

	$: otherTheme = resolveTheme(resolvedTheme);

	onMount(() => {
		mounted = true;
		/*
        Check local storage for 'theme'. 
         - If it exists and is equal to dark then set the theme to dark.
         - If it exists and is equal to light then set the theme to light.
         - If it doesn't exist then check to see if the root element classList contains the class 'dark'
         - If it does then set 'theme' in local storage to dark, otherwise set it to 'light'
        */
		const theme = localStorage.getItem('theme');
		if (theme) {
			if (theme === 'dark') {
				setTheme('dark');
			} else {
				setTheme('light');
			}
		} else {
			if (document.documentElement.classList.contains('dark')) {
				setTheme('dark');
			} else {
				setTheme('light');
			}
		}
	});
</script>

<button
	type="button"
	aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
	class="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
	on:click={() => changeTheme(resolvedTheme)}
>
	{#if resolvedTheme === 'light'}
		<SunIcon
			class="h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:hidden [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500"
		/>
	{:else}
		<MoonIcon
			class="h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500"
		/>
	{/if}
</button>
