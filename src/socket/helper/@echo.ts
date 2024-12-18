import WebSocket from "ws";
import {SocResponse} from "../interface/interface";


export default class Echo {

    static socClient(webSocket: any, jsonData: SocResponse) {

        webSocket.clients.forEach((client: any) => {
            Echo.client(client, jsonData);
        });
    }

    static roomClient(roomClients: WebSocket[], jsonData: SocResponse) {
        roomClients.forEach((client: any) => {
            Echo.client(client, jsonData);
        })
    }

    static client(ws: WebSocket, jsonData: SocResponse) {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(jsonData));
    }
}