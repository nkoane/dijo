import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { Server } from 'socket.io';

const soketIOPlugin = {
	name: 'socket-io-plugin',
	configureServer(server: any) {
		const io = new Server(server.httpServer, {});

		io.on('connection', (socket) => {
			console.log('We have a new connection! -> ', socket.id);

			socket.on('disconnect', () => {
				console.log(`server->user ${socket.id} disconnected`);
			});

			socket.on('order-placed', (order) => {
				console.log('server->order', order);
				io.emit('order', order);
			});
		});
	}
};

export default defineConfig({
	plugins: [soketIOPlugin, sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
