import { writable } from 'svelte/store';
import io from 'socket.io-client';
import { PUBLIC_SOCKET_IO_ENDPOINT } from '$env/static/public';

class Socket {
	private static instance: Socket;
	private socket;

	private constructor() {
		this.socket = writable(io(PUBLIC_SOCKET_IO_ENDPOINT));
	}

	public static getInstance() {
		if (!Socket.instance) {
			Socket.instance = new Socket();
			console.log('(lib/stores/socket) -> socket instance created.');
		}
		return Socket.instance;
	}

	public getSocket() {
		return this.socket;
	}
}

const socket = Socket.getInstance().getSocket(); //writable(io(PUBLIC_SOCKET_IO_ENDPOINT));

export default socket;
