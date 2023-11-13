import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { Server } from 'socket.io';

const myPlugin = {
    name: 'log-request-middleware',
    configureServer(server) {
        const io = new Server(server.httpServer, {});

        io.on('connection', (socket) => {
            console.log('We have a new connection!', socket.id);

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        /*
        server.middlewares.use((req, res, next) => {
            if (req.url.includes('/socket.io/')) {
                console.log('Got request', req.url, req.method, req.url.includes('/socket.io/'));
            }
            // check if the req.url has socket.io in it
            // if so, create a new socket.io server
            /*
            if (req.url.includes('/socket.io/')) {
                io.on('connection', (socket) => {
                    // ...
                });

                io.listen(3000);
            }
            // console.log(`Got request ${req.url}`, req);
            next();
        });
        */
    }
};

export default defineConfig({
    plugins: [myPlugin, sveltekit()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    }
});

/*
import { Server } from "socket.io";

const io = new Server({});

io.on("connection", (socket) => {
    // ...
  });
  
  io.listen(3000);

  */
