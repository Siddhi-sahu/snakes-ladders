//multiple games

import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME } from "./messages";

//two player will get 2 different game class? first pU = null then a user joins and 
//Every time a new GameManager is created, a new instance of the class is made but the static variables (like pendingUser) persist across all instances.
// In this case, this.pendingUser is shared among all incoming users because it is not local to the constructor.
export class GameManager {
    public player;
    public pendingUser: WebSocket | null;
    public GAMES = [];
    constructor(socket: WebSocket) {
        this.player = socket;
        this.pendingUser = null;
        this.init(socket);

    };

    //Games array contains all games instances


    init(socket: WebSocket) {
        if (this.pendingUser) {
            const game = new Game(socket, this.pendingUser);
            //start the game
            //emit init game message

            // this.GAMES.push(game)

            socket.emit(JSON.stringify({
                type: INIT_GAME
            }));

            this.pendingUser = null;

        } else {
            this.pendingUser = this.player;
        }
    }

}