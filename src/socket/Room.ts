import {roomData, SocResponse} from "./interface/interface";
import {nanoid} from "nanoid";

export class Room {
    rooms: Map<string, roomData> = new Map();

    Create(_roomID?: string): roomData {
        const roomID: string = _roomID ? _roomID : nanoid(8);

        if (!this.rooms.has(roomID))
            this.rooms.set(roomID, {
                roomID: roomID,
                isActive: false
            });

        return this.rooms.get(roomID) as roomData;
    }


}