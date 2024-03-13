import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sentrySvelteKit({
        adapter: "vercel",
        sourceMapsUploadOptions: {
            org: "firefly-software",
            project: "rr-wholesale-frontend"
        }
    }), sveltekit()],
	host: !!process.env.CODESPACES,
});