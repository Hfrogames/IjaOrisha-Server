import {Room} from "../Room";
import {roomData} from "../interface/interface";
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

        if (room.playerOneSoc && room.playerTwoSoc) {
            Echo.roomClient([room.playerOneSoc, room.playerTwoSoc], {action: "startMatch"});
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