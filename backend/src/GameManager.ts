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
    private GAMES: any;
    public users: any;
    constructor(socket: WebSocket) {
        this.player = socket;
        this.pendingUser = null;
        //Games array contains all games instances
        this.GAMES = [];
        this.users = [];
        //called automatically when a new connection joins
        this.init(socket);

    };


    addUser(socket: WebSocket) {
        this.users.push(socket);
    }

    UserRemover() {
        this.users = this.users.filter()
    }


    init(socket: WebSocket) {

        if (this.pendingUser) {
            //start the game
            const game = new Game(socket, this.pendingUser);

            if (game) {
                this.GAMES.push(game)
            }

            //emit init game message
            socket.emit(JSON.stringify({
                type: INIT_GAME
            }));

            this.pendingUser = null;

        } else {
            this.pendingUser = this.player;
        }
    }

    //handler which we would need to call

    handlers() {

    }

}