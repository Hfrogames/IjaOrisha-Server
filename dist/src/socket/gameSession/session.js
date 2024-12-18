"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../Room");
const interface_1 = require("../interface/interface");
const _echo_1 = __importDefault(require("../helper/@echo"));
class GameSession extends Room_1.Room {
    constructor() {
        super();
    }
    Join(ws, sessionData) {
        const room = this.Create(sessionData.roomID);
        if (!room.playerOneSoc) {
            room.playerOneSoc = ws;
            room.playerOne = sessionData.playerID;
        }
        else if (!room.playerTwoSoc) {
            room.playerTwoSoc = ws;
            room.playerTwo = sessionData.playerID;
        }
        _echo_1.default.client(ws, { action: interface_1.SOCKET_EVENTS.sessionJoined });
        if (room.playerOneSoc && room.playerTwoSoc) {
            _echo_1.default.roomClient([room.playerOneSoc, room.playerTwoSoc], { action: interface_1.SOCKET_EVENTS.sessionStart });
        }
    }
    StartRound() {
    }
}
exports.default = GameSession;
