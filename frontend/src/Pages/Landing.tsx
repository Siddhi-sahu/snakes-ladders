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
    //each person color assign to them
    const [color, setColor] = useState<"white" | "blue" | null>(null);
    const [lastPlayed, setLastPlayed] = useState<"white" | null | "blue">(null);
    // const [whitePosition, setWhitePosition] = useState(1);
    // const [bluePosition, setBluePosition] = useState(1);
    const diceUnicode = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const [diceFace, setDiceFace] = useState("⚀");
    const socket = useSocket();

    //moves will eb handled on the backend, just need frontend to be passive

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message", message);

            switch (message.type) {
                case INIT_GAME:
                    console.log("init");
                    //immediate assign
                    const color = message.payload.color;
                    setColor(color);
                    setStarted(true);
                    break;

                case DICE:
                    const value = message.payload.diceValue;
                    //react donot update state immediatedly but stack them together to be updated ton the next rerender so dice value would be stale here
                    setDiceValue(value);

                    //last played player i need to update with the data i am sending from the backend
                    setLastPlayed(message.payload.player);

                    //i need to set dice face/value here?/ with no stale state
                    setDiceFace(diceUnicode[value - 1])

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
        if (!socket || color === lastPlayed) {
            console.log("no socket during handlediceclick or not your turn")
            return;
        }

        //just send a dice payload, no unnecessary checks

        socket.send(JSON.stringify({
            type: DICE
        }))

    }

    //when the game start board should load
    //todo: dice should be emited to both the players[]
    //manage moves sequence[]
    //button should be disabled when there is not that perons turn

    const notYourTurn = color === null || color === lastPlayed;
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
                        <button
                            disabled={notYourTurn}
                            onClick={handleDiceClick} className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded`}>

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
