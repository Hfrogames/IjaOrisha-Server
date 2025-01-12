import { Room } from "../Room";
import { roomData, SOCKET_EVENTS } from "../interface/interface";
import Echo from "../helper/@echo";
import Round from "./round";

export default class GameSession extends Room {

    constructor() {
        super();
    }

    Join(ws: any, sessionData: any) {
        const room: roomData = this.Create(sessionData.roomID);
        if (!room.playerOneSoc && sessionData.playerOne === sessionData.playerID) {
            room.playerOneSoc = ws;
            room.playerOne = sessionData.playerID;
        } else if (!room.playerTwoSoc && sessionData.playerTwo === sessionData.playerID) {
            room.playerTwoSoc = ws;
            room.playerTwo = sessionData.playerID;
        }

        Echo.client(ws, { action: SOCKET_EVENTS.sessionJoined });

        // both player have joined the battle session
        if (room.playerOneSoc && room.playerTwoSoc) {
            room.isActive = true;
            console.log("Room created")
            Echo.roomClient([room.playerOneSoc, room.playerTwoSoc], { action: SOCKET_EVENTS.sessionStart });
            room.matchData = new Round(room);
        }
    }

    ReceiveBattleData(ws: any, sessionData: any) {
        const room: roomData = this.Get(sessionData.roomID);

        if (room.isActive && room.matchData)
            room.matchData.setPlayerData(sessionData);
    }

}

interface sessionData {
    roomID: string,
    playerOne: string,
    playerTwo: string,
}