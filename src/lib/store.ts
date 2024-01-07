// store.js
import { writable } from 'svelte/store';
import io from 'socket.io-client';
import { PUBLIC_PORT, PUBLIC_SOCKET_IO_PATH } from '$env/static/public';

// This will be your server URL where the Vite server is running
const SOCKET_SERVER_URL = 'http://localhost';

const socket = io(SOCKET_SERVER_URL + ':' + PUBLIC_PORT, {});
/*
if (PUBLIC_SOCKET_IO_PATH != '') {
	socket = io(SOCKET_SERVER_URL + ':' + PUBLIC_PORT, {
		path: '/socket.io'
	});
}
*/

console.log(
	'src->lib->stores->port',
	SOCKET_SERVER_URL,
	PUBLIC_PORT,
	`Path: ${PUBLIC_SOCKET_IO_PATH}`
	// socket
);

export const socketStore = writable(socket);
