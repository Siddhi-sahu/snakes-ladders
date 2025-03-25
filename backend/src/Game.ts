import { WebSocket } from "ws";
import { DICE, INIT_GAME } from "./messages";
import { BLUE, WHITE } from "./colors";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public moves;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = 0;
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
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: BLUE
            }
        }))
    }

    //manage moves, method runs for socket which sends the dice event from the f.e.
    manageMoves(socket: WebSocket) {
        //game starts with player 1 rolling the dice; moves increase by 1
        //random between 1 to 6
        //0 moves = white turn
        //1 moves = blue turn
        //2 moves = white turn
        //3 moves = blue turn

        if (this.moves % 2 === 0 && socket == this.player1) {
            //DRY :(
            try {
                const value = Math.ceil(Math.random() * 6);

                this.player1.send(JSON.stringify({
                    type: DICE,
                    payload: {
                        player: WHITE,
                        diceValue: value,
                    }
                }))
                this.player2.send(JSON.stringify({
                    type: DICE,
                    payload: {
                        player: BLUE,
                        diceValue: value
                    }
                }));

                this.moves = this.moves + 1;

            } catch (e) {
                console.log(e)

            }
        } else if (this.moves % 2 === 1 && socket == this.player2) {
            try {
                const value = Math.ceil(Math.random() * 6);

                this.player1.send(JSON.stringify({
                    type: DICE,
                    payload: {
                        diceValue: value,
                    }
                }))
                this.player2.send(JSON.stringify({
                    type: DICE,
                    payload: {
                        diceValue: value
                    }
                }));

                this.moves = this.moves + 1;

            } catch (e) {
                console.log(e)

            }

        } else {
            return
        }




    }

}