//entery file minimal code
//ws library for backend
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    // console.log("noew user joined, toltal number of users; ", wss.clients.size);

    gameManager.addUser(ws);
    console.log("jjjj")


    ws.on('error', console.error);

    ws.on("close", () => {
        // console.log("user disconnected, toltal number of users; ", wss.clients.size);
        gameManager.userRemover(ws);
    })


})