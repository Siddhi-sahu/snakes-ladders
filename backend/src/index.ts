//entery file minimal code
//ws library for backend
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    // console.log("noew user joined, toltal number of users; ", wss.clients.size);
    const gameManager = new GameManager(ws);

    gameManager.addUser(ws);
    console.log("jjjj")
    // gameManager.init(ws);

    ws.on('error', console.error);

    ws.on("close", () => {
        // console.log("user disconnected, toltal number of users; ", wss.clients.size);
        gameManager.UserRemover(ws);
    })


})