import { WebSocket } from "ws";
import { DICE, GAME_OVER, INIT_GAME } from "./messages";
import { BLUE, WHITE } from "./colors";
import { Board } from "./Board";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public moves;
    public whitePosition;
    public bluePosition;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = 0;
        this.whitePosition = 1;
        this.bluePosition = 1;
        this.assignColor();

        console.log("game instance is created ")

    }
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
        console.log("white position", this.whitePosition);
        console.log("blue position", this.bluePosition);

        //white dice roll and position
        if (this.moves % 2 === 0 && socket == this.player1) {
            //DRY :(
            try {
                const value = Math.ceil(Math.random() * 6);

                if (this.whitePosition + value < 100) {
                    this.whitePosition = this.whitePosition + value;
                    console.log("white position", this.whitePosition);
                    //check the position for ladders and snakes

                    this.whitePosition = Board(this.whitePosition);

                    this.player1.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: WHITE,
                            diceValue: value,
                            position: this.whitePosition
                        }
                    }))
                    this.player2.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: WHITE,
                            diceValue: value,
                            position: this.whitePosition
                        }
                    }));

                } else if (this.whitePosition + value === 100) {
                    console.log("white wins", value);
                    this.player1.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                            winner: "white"
                        }
                    }))
                    this.player2.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                            winner: "white"
                        }
                    }));

                    console.log("return from game over")
                    return;

                } else {
                    //position should not update here
                    this.player1.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: BLUE,
                            diceValue: value,
                            position: this.whitePosition
                        }
                    }))
                    this.player2.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: BLUE,
                            diceValue: value,
                            position: this.whitePosition
                        }
                    }));
                    console.log("return from overflow")

                }

                this.moves = this.moves + 1;


            } catch (e) {
                console.log(e)

            }
            //blue dice roll and position

        } else if (this.moves % 2 === 1 && socket == this.player2) {
            try {
                const value = Math.ceil(Math.random() * 6);

                if (this.bluePosition + value < 100) {
                    this.bluePosition = this.bluePosition + value;
                    console.log("blue position", this.bluePosition);
                    this.bluePosition = Board(this.bluePosition);

                    this.player1.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: BLUE,
                            diceValue: value,
                            position: this.bluePosition
                        }
                    }))
                    this.player2.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: BLUE,
                            diceValue: value,
                            position: this.bluePosition
                        }
                    }));

                } else if (this.bluePosition + value === 100) {
                    console.log("blue wins", this.bluePosition + value);
                    this.player1.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                            winner: "blue"
                        }
                    }))
                    this.player2.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                            winner: "blue"
                        }
                    }));

                    return;

                } else {
                    //position should not update here

                    this.player1.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: BLUE,
                            diceValue: value,
                            position: this.bluePosition
                        }
                    }))
                    this.player2.send(JSON.stringify({
                        type: DICE,
                        payload: {
                            player: BLUE,
                            diceValue: value,
                            position: this.bluePosition
                        }
                    }));

                }

                this.moves = this.moves + 1;

            } catch (e) {
                console.log(e)

            }

        } else {

            return;
        }
    }

}