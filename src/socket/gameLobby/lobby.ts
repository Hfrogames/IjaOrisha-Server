import WebSocket from "ws";
import {nanoid} from "nanoid";
import Echo from "../helper/@echo";
import {roomData, SOCKET_EVENTS, SocResponse, RoomAgent} from "../interface/interface";

export default class Lobby {

    static lobbyDelay = 0.1;
    static robotTime: NodeJS.Timeout;
    static Rooms: Map<string, roomData> = new Map();

    static Create(): roomData {
        const roomID = nanoid(8);

        if (!Lobby.Rooms.has(roomID)) Lobby.Rooms.set(roomID, {
            roomID: roomID,
            isActive: false
        });

        return Lobby.Rooms.get(roomID) as roomData;
    }

    static GetRoom(): roomData {
        // check if there is any available room
        // create new room is all room is full

        let availableRoom!: roomData;

        Lobby.Rooms.forEach(room => {
            if (!room.isActive) return availableRoom = room;
        });

        return availableRoom ? availableRoom : Lobby.Create();
    }

    static Join(ws: any, player: any): void {
        const room = Lobby.GetRoom();

        // same player try to join
        if (player.playerID === room.playerOne) {
            room.playerOneSoc = ws;
            Echo.client(ws, {action: SOCKET_EVENTS.lobbyJoined});
        } else if (player.playerID === room.playerTwo) {
            room.playerTwoSoc = ws;
            Echo.client(ws, {action: SOCKET_EVENTS.lobbyJoined});
        }

        if (player.playerID === room.playerOne || player.playerID === room.playerTwo) return;

        if (!room.playerOneSoc) {
            room.playerOne = player.playerID;
            room.playerOneSoc = ws;
            Lobby.robotTime = setTimeout(() => Lobby.pairedWithRobot(room), Lobby.lobbyDelay * 60000);
        } else if (!room.playerTwoSoc) {
            room.playerTwo = player.playerID;
            room.playerTwoSoc = ws;
        }

        Echo.client(ws, {action: SOCKET_EVENTS.lobbyJoined});

        Lobby.pairedWithPlayer(room);

    }

    static pairedWithPlayer(room: roomData) {
        if (room.playerOneSoc && room.playerTwoSoc) {
            room.isActive = true;
            const resp: SocResponse = {
                action: SOCKET_EVENTS.sessionPaired,
                roomID: room.roomID,
                playerOne: room.playerOne,
                playerTwo: room.playerTwo,
            }

            Echo.client(room.playerOneSoc as WebSocket, resp);
            Echo.client(room.playerTwoSoc as WebSocket, resp);
        }
    }

    static pairedWithRobot(room: roomData) {

        // make player play with robot
        if (room.playerTwo) return;
        console.log("Room paired with robot");
        room.playerTwo = RoomAgent.Felix;
        room.playerTwoSoc = undefined;
        room.isActive = true;
        room.isRobot = true;
        const resp: SocResponse = {
            action: SOCKET_EVENTS.sessionPaired,
            roomID: room.roomID,
            playerOne: room.playerOne,
            playerTwo: room.playerTwo,
        }

        Echo.client(room.playerOneSoc as WebSocket, resp);
    }
}

