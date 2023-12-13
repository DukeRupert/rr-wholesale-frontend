import type { ToastData } from '$lib/components/toast/index.svelte';

export interface ToastPayload {
	detail: ToastData;
}

export interface ToastEvent {
	success: ToastPayload;
	warning: ToastPayload;
	error: ToastPayload;
}
