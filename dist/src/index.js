"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = __importDefault(require("ws"));
const routes_1 = __importDefault(require("./express/routes"));
const gameLobby_1 = __importDefault(require("./socket/gameLobby"));
const gameSession_1 = __importDefault(require("./socket/gameSession"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = (0, http_1.createServer)(app);
const gmLobbySocket = new ws_1.default.Server({ noServer: true });
const gmSessionSocket = new ws_1.default.Server({ noServer: true });
(0, gameLobby_1.default)(gmLobbySocket);
(0, gameSession_1.default)(gmSessionSocket);
server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = new URL(request.url, 'wss://base.url');
    console.log(pathname);
    if (pathname === '/lobby') {
        gmLobbySocket.handleUpgrade(request, socket, head, function done(ws) {
            gmLobbySocket.emit('connection', ws, request);
        });
    }
    else if (pathname === '/session') {
        gmSessionSocket.handleUpgrade(request, socket, head, function done(ws) {
            gmSessionSocket.emit('connection', ws, request);
        });
    }
    else {
        socket.destroy();
    }
});
app.use((0, routes_1.default)());
server.listen(port, function () {
    console.log(`Listening on http://localhost:${port}`);
});
