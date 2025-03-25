import { WebSocket } from "ws";
import { INIT_GAME } from "./messages";
import { BLUE, WHITE } from "./colors";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.assignColor();

        console.log("game instance is created ")

    }

    //emit init message to both players with their assigned colors

    assignColor() {
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: WHITE
            }
        }))
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: BLUE
            }
        }))
    }

}