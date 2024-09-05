import { writable } from 'svelte/store';

export const isLoggedInStore = writable(false);
export const usernameStore = writable("");

