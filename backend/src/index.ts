//entery file minimal code
//ws library for backend
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    const gameManager = new GameManager(ws);
    ws.on("open", () => {
        gameManager.
    })
    ws.on('error', console.error);


})