import WebSocket from "ws";
import Lobby from "./lobby";


export default function wsManager(webSocket: any) {
    webSocket.on('connection', (ws: any) => {
        console.log("client connected.");

        ws.on('message', (data: any) => {
            try {
                const messageData = JSON.parse(data);

                console.log(messageData);

                switch (messageData.action) {
                    case "join":
                        Lobby.Join(ws,messageData);
                        // console.log(Lobby.Rooms);
                        break;
                    default:
                        console.error(messageData.action);
                        break;
                }

            } catch (error) {
                console.log(error);
            }
        })

        ws.on('close', function () {
            console.log("client left.");
        });
    });
}
