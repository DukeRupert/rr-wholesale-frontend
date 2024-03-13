import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess({}), preprocessMeltUI()]),
	kit: {
		adapter: adapter({
			images: {
				sizes: [320, 640, 768, 1024, 1280, 1920, 2560, 3840],
				formats: ['image/avif', 'image/webp', 'image/jpeg'],
				minimumCacheTTL: 300
			}
		}),
		csrf: {
			checkOrigin: false
		}
	}
};
export default config;
