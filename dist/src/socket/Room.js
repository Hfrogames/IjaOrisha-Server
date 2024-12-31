"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const nanoid_1 = require("nanoid");
class Room {
    rooms = new Map();
    Create(_roomID) {
        const roomID = _roomID ? _roomID : (0, nanoid_1.nanoid)(8);
        if (!this.rooms.has(roomID))
            this.rooms.set(roomID, {
                roomID: roomID,
                isActive: false
            });
        return this.rooms.get(roomID);
    }
    Get(roomID) {
        return this.rooms.get(roomID);
    }
}
exports.Room = Room;
