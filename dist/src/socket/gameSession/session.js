"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../Room");
const interface_1 = require("../interface/interface");
const _echo_1 = __importDefault(require("../helper/@echo"));
const round_1 = __importDefault(require("./round"));
class GameSession extends Room_1.Room {
    constructor() {
        super();
    }
    Join(ws, sessionData) {
        const room = this.Create(sessionData.roomID);
        this.PairedWithPlayer(ws, room, sessionData);
        this.PairedWithRobot(ws, room, sessionData);
    }
    PairedWithPlayer(ws, room, sessionData) {
        if (sessionData.playerTwo === interface_1.RoomAgent.Felix)
            return;
        if (!room.playerOneSoc && sessionData.playerOne === sessionData.playerID) {
            room.playerOneSoc = ws;
            room.playerOne = sessionData.playerID;
        }
        else if (!room.playerTwoSoc && sessionData.playerTwo === sessionData.playerID) {
            room.playerTwoSoc = ws;
            room.playerTwo = sessionData.playerID;
        }
        _echo_1.default.client(ws, { action: interface_1.SOCKET_EVENTS.sessionJoined });
        // both player have joined the battle session
        if (room.playerOneSoc && room.playerTwoSoc) {
            room.isActive = true;
            _echo_1.default.roomClient([room.playerOneSoc, room.playerTwoSoc], { action: interface_1.SOCKET_EVENTS.sessionStart });
            room.matchData = new round_1.default(room);
        }
    }
    PairedWithRobot(ws, room, sessionData) {
        if (sessionData.playerTwo !== interface_1.RoomAgent.Felix)
            return;
        if (!room.playerOneSoc && sessionData.playerOne === sessionData.playerID) {
            room.playerOneSoc = ws;
            room.playerOne = sessionData.playerID;
        }
        if (room.playerTwo === interface_1.RoomAgent.Felix) {
            room.playerTwoSoc = undefined;
            room.playerTwo = interface_1.RoomAgent.Felix;
        }
        _echo_1.default.client(ws, { action: interface_1.SOCKET_EVENTS.sessionJoined });
        setTimeout(() => {
            room.isActive = true;
            room.isRobot = true;
            _echo_1.default.client(ws, { action: interface_1.SOCKET_EVENTS.sessionStart });
            room.matchData = new round_1.default(room);
        }, 1000);
    }
    ReceiveBattleData(ws, sessionData) {
        const room = this.Get(sessionData.roomID);
        if (room.isActive && room.matchData)
            room.matchData.setPlayerData(sessionData);
    }
}
exports.default = GameSession;
