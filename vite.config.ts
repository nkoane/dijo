import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { Server } from 'socket.io';
import { type ViteDevServer } from 'vite';

export const socketIOPlugin = {
	name: 'socket-io-plugin',
	configureServer(server: ViteDevServer) {
		console.log(`vite.config->server->initialisation: (${server.httpServer})})`);

		if (!server.httpServer) return;

		const io = new Server(server.httpServer, {});

		console.log(`vite.config->server->started: (${io.engine.clientsCount}) before`);
		//console.log(`vite.config->server->started: (${io.engine.clientsCount}) after`, io);
		io.on('pong', (latency) => {
			console.log(`vite.config->server->pong: ${latency}ms`);
		});
		io.on('connection', (socket) => {
			console.log(
				'vite.config->server->client->connected: ',
				socket.id,
				`(${io.engine.clientsCount})`
			);

			// console.log('vite.config->server->client->connected->rooms: ', socket.rooms);
			// console.log('vite.config->server->client->connected->clients: ', io.sockets.sockets);

			socket.on('ping', () => {
				console.log(
					`vite.config->socket->client->ping ${socket.id}`,
					`(${io.engine.clientsCount})`
				);
			});

			socket.on('pong', (latency) => {
				console.log(
					`vite.config->socket->client->pong ${socket.id}`,
					`(${io.engine.clientsCount})`,
					latency
				);
			});

			socket.on('connect', (reason) => {
				console.log(
					`vite.config->socket->client->connect ${socket.id}`,
					`(${io.engine.clientsCount})`,
					reason
				);
			});

			socket.on('reconnect', (reason) => {
				console.log(
					`vite.config->socket->client->reconnect ${socket.id}`,
					`(${io.engine.clientsCount})`,
					reason
				);
			});
			socket.on('disconnect', (reason) => {
				console.log(
					`vite.config->socket->client->disconnected ${socket.id}`,
					`(${io.engine.clientsCount})`,
					reason
				);
			});
			socket.on('disconnecting', (reason) => {
				console.log(
					`vite.config->socket->client->disconnecting ${socket.id}`,
					`(${io.engine.clientsCount})`,
					reason
				);
			});

			socket.on('order-placed', (order) => {
				console.log('vite.config->socket->client->order->placed:', order.id, `/v ${socket.id}`);
				io.emit('order', order);
			});
		});

		io.on('error', (err) => {
			console.log('vite.config->server->error', err);
		});

		// // make all Socket instances disconnect
		// io.disconnectSockets();
	}
};
/*
const SIO = () => {
	return {
		name: 'socket-io-plugin',
		configureServer(server: any) {
			console.log(`vite.config->server->initialisation: (${server.httpServer})})`);
			const io = new Server(server.httpServer, {
				path: '/'
			});

			io.on('connection', (socket) => {
				console.log(
					'vite.config->server->client->connected: ',
					socket.id,
					`(${io.engine.clientsCount})`
				);
			});
		}
	};
};
*/

export default defineConfig({
	plugins: [sveltekit(), socketIOPlugin],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
