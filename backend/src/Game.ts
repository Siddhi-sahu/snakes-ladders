import { WebSocket } from "ws";
import { BLUE } from "./colors";


export class Game {
    public player1: WebSocket;
    public player2: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
    }


    // assignColor(){
    //     this.player1.
    // }

}