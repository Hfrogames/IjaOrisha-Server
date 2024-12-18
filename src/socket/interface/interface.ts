import WebSocket from "ws";

export interface SocResponse {
    action: string,
    roomID?: string,
    playerOne?: string,
    playerTwo?: string,
}

export enum SOCKET_EVENTS {
    lobbyJoined = 'lobbyJoined',
    sessionPaired = 'sessionPaired',
    sessionJoined = 'sessionJoined',
    sessionStart = 'sessionStart',
}

export interface roomData {
    playerOneSoc?: WebSocket,
    playerTwoSoc?: WebSocket,
    playerOne?: string,
    playerTwo?: string,
    matchData?: string,
    isActive: boolean,
    roomID: string,
}