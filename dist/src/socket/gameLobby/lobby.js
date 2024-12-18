"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const _echo_1 = __importDefault(require("../helper/@echo"));
const interface_1 = require("../interface/interface");
class Lobby {
    static Rooms = new Map();
    static Create() {
        const roomID = (0, nanoid_1.nanoid)(8);
        if (!Lobby.Rooms.has(roomID))
            Lobby.Rooms.set(roomID, {
                roomID: roomID,
                isActive: false
            });
        return Lobby.Rooms.get(roomID);
    }
    static GetRoom() {
        // check if there is any available room
        // create new room is all room is full
        let availableRoom;
        Lobby.Rooms.forEach(room => {
            if (!room.isActive)
                return availableRoom = room;
        });
        return availableRoom ? availableRoom : Lobby.Create();
    }
    static Join(ws, player) {
        const room = Lobby.GetRoom();
        if (!room.playerOneSoc) {
            room.playerOne = player.playerID;
            room.playerOneSoc = ws;
        }
        else if (!room.playerTwoSoc) {
            room.playerTwo = player.playerID;
            room.playerTwoSoc = ws;
        }
        _echo_1.default.client(ws, { action: interface_1.SOCKET_EVENTS.lobbyJoined });
        if (room.playerOneSoc && room.playerTwoSoc) {
            room.isActive = true;
            const resp = {
                action: interface_1.SOCKET_EVENTS.sessionPaired,
                roomID: room.roomID,
                playerOne: room.playerOne,
                playerTwo: room.playerTwo,
            };
            _echo_1.default.client(room.playerOneSoc, resp);
            _echo_1.default.client(room.playerTwoSoc, resp);
        }
    }
}
exports.default = Lobby;
