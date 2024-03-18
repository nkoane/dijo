import express from 'express';
import { createServer } from 'http';
import { webSocketServer } from './sockets.js';

import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);

webSocketServer.configureServer({ httpServer: server });

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server

app.use(handler);
server.listen(port);
