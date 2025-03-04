//multiple games

import { WebSocket } from "ws";

export class GameManager {
    public player;
    public pendingUser: WebSocket;
    constructor(socket: WebSocket) {
        this.player = socket;

    };

    init() {
        if (this.pendingUser) {
            //start the game
            //emit init game message

        } else {
            this.pendingUser = this.player;
        }
    }

}