import { writable, type Writable } from 'svelte/store';

// Controls processing dialog
export const processing = writable(false);

// Controls cart status
export const is_cart_open = writable(false);
