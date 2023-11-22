import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { Server } from 'socket.io';

const socketIOPlugin = {
	name: 'socket-io-plugin',
	configureServer(server: any) {
		const io = new Server(server.httpServer, {});

		io.on('connection', (socket) => {
			console.log('socket->connected: ', socket.id, `(${io.engine.clientsCount})`);

			socket.on('disconnect', () => {
				console.log(
					`server->user->disconnected ${socket.id} disconnected`,
					`(${io.engine.clientsCount})`
				);
			});

			socket.on('order-placed', (order) => {
				console.log('server->order->placed:', order.id, `/v ${socket.id}`);
				io.emit('order', order);
			});
		});

		io.on('error', (err) => {
			console.log('io:server error', err);
		});

		// // make all Socket instances disconnect
		//io.disconnectSockets();
	}
};

export default defineConfig({
	plugins: [socketIOPlugin, sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
