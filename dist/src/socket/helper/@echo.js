"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class Echo {
    static socClient(webSocket, jsonData) {
        webSocket.clients.forEach((client) => {
            Echo.client(client, jsonData);
        });
    }
    static roomClient(roomClients, jsonData) {
        roomClients.forEach((client) => {
            Echo.client(client, jsonData);
        });
    }
    static client(ws, jsonData) {
        if (ws.readyState === ws_1.default.OPEN)
            ws.send(JSON.stringify(jsonData));
    }
}
exports.default = Echo;
