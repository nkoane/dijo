import { writable } from 'svelte/store';
import io from 'socket.io-client';
import { PUBLIC_SOCKET_IO_ENDPOINT } from '$env/static/public';

const socket = writable(io(PUBLIC_SOCKET_IO_ENDPOINT));

export default socket;
