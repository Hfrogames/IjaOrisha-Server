"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wsManager;
const lobby_1 = __importDefault(require("./lobby"));
function wsManager(webSocket) {
    webSocket.on('connection', (ws) => {
        console.log("client connected.");
        ws.on('message', (data) => {
            try {
                const messageData = JSON.parse(data);
                console.log(messageData);
                switch (messageData.action) {
                    case "join":
                        lobby_1.default.Join(ws, messageData);
                        console.log(lobby_1.default.Rooms);
                        break;
                    default:
                        console.error(messageData.action);
                        break;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        ws.on('close', function () {
            console.log("client left.");
        });
    });
}
