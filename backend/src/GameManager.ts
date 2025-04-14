//multiple games

import { WebSocket } from "ws";
import { Game } from "./Game";
import { DICE, INIT_GAME } from "./messages";

//two player will get 2 different game class? first pU = null then a user joins and 
//Every time a new GameManager is created a new instance of the class is made but the static variables (like pendingUser) persist across all instances.
//  this.pendingUser is shared among all incoming users because it is not local to the constructor
export class GameManager {
    private pendingUser: WebSocket | null;
    private GAMES: any;
    private users: any;
    constructor() {
        this.pendingUser = null;
        //Games array contains all games instances
        this.GAMES = [];
        this.users = [];

    };


    addUser(socket: WebSocket) {
        this.users.push(socket);
        console.log("user length:,", this.users.length)
        //called automatically when a new connection joins
        this.initHandlers(socket);
    }

    userRemover(socket: WebSocket) {
        this.users = this.users.filter((user: any) => user !== socket);
        console.log(this.users.length)

    }


    initHandlers(socket: WebSocket) {

        //pending user is not persisiting

        socket.onmessage = (event: any) => {
            const message = JSON.parse(event.data);
            console.log("message", message)
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    //start the game
                    console.log("both5")

                    try {
                        console.log("both1")

                        const game = new Game(this.pendingUser, socket);
                        console.log("both2")


                        if (game) {
                            this.GAMES.push(game)
                            console.log("both3")

                        }

                        //emit init game message
                        // socket.send(JSON.stringify({
                        //     type: INIT_GAME
                        // }));

                        this.pendingUser = null;
                        console.log("both")

                    } catch (e) {
                        console.log("game is not created", e)
                    }


                } else {
                    try {

                        this.pendingUser = socket;
                        console.log("pensding user is created")
                    } catch (e) {
                        console.log("pensding user is not created", e)
                    }
                }

            }
            if (message.type === DICE) {
                const game: Game = this.GAMES.find((GAME: Game) => GAME.player1 === socket || GAME.player2 === socket);

                game.manageMoves(socket)

            }

        }


    }

}