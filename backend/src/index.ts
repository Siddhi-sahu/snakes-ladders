//entery file minimal code
//ws library for backend
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received:', data);

    });

    ws.send('seomthing');
})