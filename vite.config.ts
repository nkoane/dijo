import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './server/sockets';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
