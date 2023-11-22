// store.js
import { writable } from 'svelte/store';
import io from 'socket.io-client';

// This will be your server URL where the Vite server is running
const SOCKET_SERVER_URL = 'http://localhost:5173';

const socket = io(SOCKET_SERVER_URL);

export const socketStore = writable(socket);
