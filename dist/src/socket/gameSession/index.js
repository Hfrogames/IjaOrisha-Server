"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = gmSession;
const session_1 = __importDefault(require("./session"));
function gmSession(webSocket) {
    const gameSession = new session_1.default();
    webSocket.on('connection', (ws) => {
        console.log("client connected to session update.");
        ws.on('message', (data) => {
            try {
                const messageData = JSON.parse(data);
                // console.log(messageData);
                switch (messageData.action) {
                    case "join":
                        gameSession.Join(ws, messageData);
                        break;
                    case "getBattleData":
                        gameSession.ReceiveBattleData(ws, messageData);
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
