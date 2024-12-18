import express, {Express} from "express";
import {createServer} from 'http';
import WebSocket from "ws";
import route from "./express/routes";
import gmLobby from "./socket/gameLobby";
import gmSession from "./socket/gameSession";

const app: Express = express();
const port = process.env.PORT || 3000;

const server = createServer(app);

const gmLobbySocket = new WebSocket.Server({noServer: true});
const gmSessionSocket = new WebSocket.Server({noServer: true});

gmLobby(gmLobbySocket);
gmSession(gmSessionSocket);

server.on('upgrade', function upgrade(request, socket, head) {
    const {pathname} = new URL(request.url as string, 'wss://base.url');

    console.log(pathname);

    if (pathname === '/lobby') {
        gmLobbySocket.handleUpgrade(request, socket, head, function done(ws) {
            gmLobbySocket.emit('connection', ws, request);
        });
    } else if (pathname === '/session') {
        gmSessionSocket.handleUpgrade(request, socket, head, function done(ws) {
            gmSessionSocket.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

app.use(route());


server.listen(port, function () {
    console.log(`Listening on http://localhost:${port}`);
});