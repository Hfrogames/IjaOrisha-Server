import {Room} from "../Room";
import {roomData, SOCKET_EVENTS} from "../interface/interface";
import Echo from "../helper/@echo";

export default class GameSession extends Room {
    constructor() {
        super();
    }

    Join(ws: any, sessionData: any) {
        const room: roomData = this.Create(sessionData.roomID);
        if (!room.playerOneSoc) {
            room.playerOneSoc = ws;
            room.playerOne = sessionData.playerID;
        } else if (!room.playerTwoSoc) {
            room.playerTwoSoc = ws;
            room.playerTwo = sessionData.playerID;
        }

        Echo.client(ws,{action: SOCKET_EVENTS.sessionJoined});

        if (room.playerOneSoc && room.playerTwoSoc) {
            Echo.roomClient([room.playerOneSoc, room.playerTwoSoc], {action: SOCKET_EVENTS.sessionStart});
        }
    }

    StartRound() {

    }
}

interface sessionData {
    roomID: string,
    playerOne: string,
    playerTwo: string,
}