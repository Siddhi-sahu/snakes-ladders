//entery file minimal code
//ws library for backend
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const GameManager: any = new GameManager(wss);
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);


})