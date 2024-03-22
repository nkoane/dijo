/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Server } from 'socket.io';

export const webSocketServer = {
	name: 'web-socket-server',
	configureServer(server) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer, {
			cors: {
				origin: 'http://localhost:5173',
				credentials: true,
				methods: ['GET', 'POST']
			}
		});

		io.on('connection', (socket) => {
			console.log(`io-server -> socket ${socket.id} connected`);

			socket.on('disconnect', (reason) => {
				console.log(`io-server -> socket ${socket.id} disconnected due to ${reason}`);
			});
			socket.on('menu-order-placed', (data) => {
				console.log(`io-server -> recieved-order -> `, data);

				socket.broadcast.emit('kitchen-order-new', data);
			});
		});
	}
};
