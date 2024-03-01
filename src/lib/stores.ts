import { writable } from 'svelte/store';

// Controls processing dialog
export const processing = writable(false);

// Controlls cart status
export const is_cart_open = writable(false);
