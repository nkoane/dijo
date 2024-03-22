import express from 'express';
import { createServer } from 'http';
import { webSocketServer } from './sockets.js';

import { handler } from '../build/handler.js';

const port = 5173;
const app = express();
const server = createServer(app);

webSocketServer.configureServer({ httpServer: server });

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server

app.use(handler);

console.info(`Server running at: http://localhost:${port}/`);
server.listen(port);
