import GameSession from "./session";


export default function gmSession(webSocket: any) {
    const gameSession = new GameSession();

    webSocket.on('connection', (ws: any) => {
        console.log("client connected to session.");

        ws.on('message', (data: any) => {
            try {
                const messageData = JSON.parse(data);

                // console.log(messageData);

                switch (messageData.action) {
                    case "join":
                        gameSession.Join(ws, messageData);
                        break;
                    case "getBattleData":
                        gameSession.ReceiveBattleData(ws, messageData);
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
