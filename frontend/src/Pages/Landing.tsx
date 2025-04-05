import { useEffect, useState } from "react";
import Image from "../assets/snake-and-ladders-multiplayer.webp";
import { useSocket } from "../hooks/Socket";
import { Board } from "../Components/Board";

export const INIT_GAME = "init_game";
export const DICE = "dice";
export const GAME_OVER = "game_over";

export const Landing = () => {
    const [clicked, setClicked] = useState(false);
    const [started, setStarted] = useState(false);
    const [diceValue, setDiceValue] = useState<number>(1);
    const [player, setPlayer] = useState<"white" | "blue">("white");
    const [whitePosition, setWhitePosition] = useState(1);
    const [bluePosition, setBluePosition] = useState(1);
    const diceUnicode = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const [diceFace, setDiceFace] = useState("⚀");
    let moves = 0;
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message", message);

            switch (message.type) {
                case INIT_GAME:
                    console.log("init");
                    const color = message.payload.color;
                    console.log("COLOR", color);
                    setStarted(true);
                    break;

                case DICE:
                    moves += 1;
                    console.log("moves", moves);
                    setDiceValue(() => {
                        const newDiceValue = message.payload.diceValue;
                        return newDiceValue;
                    });
                    // console.log("diceValue", diceValue);
                    setPlayer(() => {
                        const newPlayer = message.payload.player;
                        return newPlayer
                    });
                    console.log("player ", player)


                    break;
                case GAME_OVER:
                    console.log("dice");
                    break;

                default:
                    break;
            }

        }


    }, [socket])
    const handleClick = () => {
        setClicked(true);
        if (!socket) {
            return;

        }
        socket.send(JSON.stringify({
            type: INIT_GAME
        }));

    }
    const handleDiceClick = () => {
        if (!socket) return;


        if (moves % 2 === 0 && player === "white") {
            console.log(" white clicked");
            console.log(diceValue);

            try {
                socket.send(JSON.stringify({
                    type: DICE
                }))
                setInterval(() => {
                    setDiceFace(diceUnicode[diceValue - 1])

                }, 500);


            } catch (e) {
                console.log("error in dice: ", e)
            }

        } else if (moves % 2 === 1 && player === "blue") {
            console.log(" blue clicked");
            console.log(diceValue);
            try {
                socket.send(JSON.stringify({
                    type: DICE
                }))
                setInterval(() => {
                    setDiceFace(diceUnicode[diceValue - 1])

                }, 500);


            } catch (e) {
                console.log("error in dice: ", e)
            }


        } else {
            return;
        }

    }

    //when the game start board should load
    //todo: dice should be emited to both the players[]
    //manage moves sequence[]
    return <>
        {
            started ?
                <div className="flex justify-center items-center bg-black h-screen">
                    <div>
                        <Board />

                    </div>
                    <div className="ml-10">
                        <div className="bg-red text-white text-9xl flex items-center justify-center">
                            {diceFace}
                        </div>
                        <button onClick={handleDiceClick} className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded`}>

                            Roll the dice
                        </button>

                    </div>
                </div>
                : (
                    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 min-h-screen p-6 bg-gradient-to-r from-orange-300 to-orange-600">
                        {/* Left - Image Section */}
                        <div className="p-4 rounded-2xl shadow-lg bg-yellow-300">
                            <img src={Image} className="w-full h-full object-cover rounded-2xl border-4 border-yellow-400" alt="Snakes and Ladders" />
                        </div>

                        {/* Right - Play Now Section */}
                        <div className="flex flex-col justify-center items-center bg-yellow-300 p-8 rounded-2xl shadow-lg ">
                            <h2 className="text-green-900 text-3xl font-bold mb-4 font-[Comic Sans MS]">Ready to Play?</h2>
                            {clicked === false ? <button className="mb-6  bg-gradient-to-r from-orange-600 to-orange-400 text-lg font-bold px-10 py-4  text-white rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl" onClick={handleClick}>
                                🎲 Play Now!
                            </button> : "Connecting...."}
                        </div>
                    </div>

                )



        }



    </>

};
