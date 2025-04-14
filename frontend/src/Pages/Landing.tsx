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
    // const [diceValue, setDiceValue] = useState<number>(1);
    //each person color assign to them
    const [color, setColor] = useState<"white" | "blue" | null>(null);
    const [lastPlayed, setLastPlayed] = useState<"white" | null | "blue">(null);
    const [whitePosition, setWhitePosition] = useState<number>(1);
    const [bluePosition, setBluePosition] = useState<number>(1);
    const diceUnicode = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const [diceFace, setDiceFace] = useState("⚀");
    const [diceRolling, setDiceRolling] = useState(false);

    const [winner, setWinner] = useState<null | "white" | "blue">(null);
    const [currentTurn, setCurrentTurn] = useState<"white" | "blue">("white");
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
                    setColor(color);
                    setStarted(true);
                    break;

                case DICE:
                    const value = message.payload.diceValue;
                    const position = message.payload.position;
                    const player = message.payload.player;
                    //react donot update state immediatedly but stack them together to be updated ton the next rerender so dice value would be stale here
                    setDiceRolling(true);

                    const rollingInterval = setInterval(() => {
                        const randomIndex = Math.floor(Math.random() * 6);
                        setDiceFace(diceUnicode[randomIndex]);
                    }, 100);


                    setTimeout(() => {
                        clearInterval(rollingInterval);
                        setDiceFace(diceUnicode[value - 1]);
                        setLastPlayed(player);
                        setDiceRolling(false);

                        if (player === "white") {
                            setWhitePosition(position);
                            setCurrentTurn("blue");
                        } else {
                            setBluePosition(position);
                            setCurrentTurn("white");
                        }
                    }, 800);

                    if (player === "white") {
                        setWhitePosition(position);
                        setCurrentTurn("blue")
                    } else {
                        setBluePosition(position);
                        setCurrentTurn("white")
                    }


                    break;
                case GAME_OVER:
                    console.log("game over");
                    const winnerr = message.payload.winner;
                    setWinner(winnerr);
                    if (winnerr === "white") {

                        setWhitePosition(100)
                    } else {
                        setBluePosition(100)
                    }
                    break;

                default:
                    break;
            }

        }

    }, [socket, diceUnicode])
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
        if (!socket || color === lastPlayed || diceRolling) {
            console.log("no socket during handlediceclick or not your turn  or dice already rolling")
            return;
        }

        //just send a dice payload, no unnecessary checks

        socket.send(JSON.stringify({
            type: DICE
        }))

    }


    const yourTurn = color !== null && color !== lastPlayed && !diceRolling;

    const renderDice = () => {
        return (
            <div
                className={`relative w-32 h-32 transform transition-all duration-500 ${diceRolling ? 'animate-bounce' : ''}`}
                onClick={yourTurn ? handleDiceClick : undefined}
            >
                <div className={`
                    absolute inset-0 bg-white rounded-xl shadow-lg flex items-center justify-center text-8xl
                    transition-all duration-300
                    ${diceRolling ? 'animate-spin' : ''}
                    ${yourTurn && !diceRolling ? 'cursor-pointer hover:scale-110 hover:rotate-6' : ''}
                `}>
                    {diceFace}
                </div>
                {yourTurn && !diceRolling && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl blur opacity-30 -z-10 animate-pulse"></div>
                )}
            </div>
        );
    };

    const renderLoadingAnimation = () => {
        return (
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-8 border-amber-300 border-t-amber-600 animate-spin"></div>
                    <div className="absolute inset-0 w-20 h-20 rounded-full border-8 border-transparent border-b-amber-600 animate-spin animation-delay-500"></div>
                </div>
                <div className="text-green-800 text-xl font-bold relative overflow-hidden">
                    <span className="inline-block">Connecting</span>
                    <span className="inline-block ml-1 w-5">
                        <span className="absolute dots-animation">.</span>
                        <span className="absolute dots-animation animation-delay-300">.</span>
                        <span className="absolute dots-animation animation-delay-600">.</span>
                    </span>
                </div>
            </div>
        );
    };
    return <>
        <style>{`
                @keyframes dots-animation {
                    0%, 20% { opacity: 0; transform: translateY(5px); }
                    50% { opacity: 1; transform: translateY(0); }
                    80%, 100% { opacity: 0; transform: translateY(-5px); }
                }
                .dots-animation {
                    animation: dots-animation 1.5s infinite;
                }
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .float-animation {
                    animation: float 6s ease-in-out infinite;
                }
                .float-animation-delay {
                    animation: float 7s ease-in-out infinite;
                    animation-delay: 1s;
                }
            `}</style>

        {started ? (
            <div className="flex justify-center items-center bg-gradient-to-b from-green-900 via-green-800 to-amber-900 min-h-screen p-6">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 text-4xl float-animation">🌼</div>
                    <div className="absolute top-20 right-20 text-4xl float-animation-delay">🌿</div>
                    <div className="absolute top-10 left-10 text-4xl float-animation">🌼</div>
                    <div className="absolute top-20 right-20 text-4xl float-animation-delay">🌿</div>
                    <div className="absolute bottom-10 left-32 text-4xl float-animation">🌼</div>
                    <div className="absolute bottom-40 right-10 text-4xl float-animation-delay">🌿</div>
                    <div className="absolute top-64 left-1/4 text-4xl float-animation">🌿</div>
                    <div className="absolute bottom-20 right-1/4 text-4xl float-animation-delay">🌼</div>
                    <div className="absolute top-64 left-1/4 text-4xl float-animation">🌿</div>
                    <div className="absolute bottom-20 right-1/4 text-4xl float-animation-delay">🌼</div>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-center items-center gap-8 w-full max-w-6xl z-10">
                    <div className="w-full lg:w-3/5 transform transition-all duration-500">
                        <div className="bg-gradient-to-br from-yellow-600 to-amber-700 p-6 rounded-xl shadow-2xl border-4 border-yellow-600 transition-all duration-500 hover:shadow-amber-600/20">
                            <h2 className="text-white text-center text-2xl font-bold mb-4 font-[Comic Sans MS] drop-shadow-md">Snakes & Ladders</h2>
                            <Board whitePosition={whitePosition} bluePosition={bluePosition} />
                        </div>
                    </div>

                    {!winner && (
                        <div className="w-full lg:w-2/5 flex flex-col items-center transform transition-all duration-500">
                            <div className={`${color === "white" ? "text-white" : "text-blue-300"} font-bold text-2xl mb-4 drop-shadow-md transition-all duration-300`}>
                                You are {color}
                            </div>

                            <div className="bg-amber-100 bg-opacity-20 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-amber-400 border-opacity-30 transition-all duration-500 hover:shadow-amber-500/30">
                                <div className="flex justify-center mb-6">
                                    {renderDice()}
                                </div>

                                <button
                                    disabled={!yourTurn}
                                    onClick={handleDiceClick}
                                    className={`w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300
                                            ${!yourTurn
                                            ? "bg-amber-500 bg-opacity-50 cursor-not-allowed"
                                            : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:scale-105"
                                        } text-amber-900`}>
                                    {diceRolling ? "Rolling..." : "Roll the dice"}
                                </button>

                                <div className="text-center mt-6">
                                    <span className="bg-amber-900 bg-opacity-70 text-amber-100 px-4 py-2 rounded-full inline-block shadow transition-all duration-300 hover:bg-amber-800">
                                        Turn: <span className={`font-bold ${currentTurn === "white" ? "text-white" : "text-blue-300"} transition-colors duration-300`}>
                                            {currentTurn}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {winner && (
                        <div className="w-full lg:w-2/5 flex flex-col items-center transform transition-all duration-1000 animate-fadeIn">
                            <div className="bg-amber-100 bg-opacity-20 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-amber-400 border-opacity-30 transition-all duration-500">
                                <div className="text-9xl flex items-center justify-center mb-6 animate-bounce">
                                    {winner === color ? "🏆" : "😢"}
                                </div>
                                <div className={`text-2xl text-center font-bold mb-6 ${winner === color ? "text-yellow-300" : "text-amber-200"} transition-all duration-500`}>
                                    {winner === color
                                        ? "You won the game!"
                                        : "Better luck next time!"
                                    }
                                </div>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300
                                            bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 
                                            shadow-lg hover:shadow-xl hover:scale-105 text-amber-900">
                                    Play Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="min-h-screen bg-gradient-to-r from-green-400 to-yellow-400 p-6 transition-all duration-1000">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-yellow-300 p-4 rounded-3xl shadow-2xl border-4 border-yellow-500 transition-all duration-500 hover:shadow-yellow-600/30">
                        <div className="p-4 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-green-100 to-amber-100 transition-all duration-500 hover:shadow-inner">
                            <div className="relative">
                                <img src={Image} className="w-full h-full object-cover rounded-xl border-4 border-yellow-500 transition-transform duration-700 hover:scale-105" alt="Snakes and Ladders" />
                                <div className="absolute bottom-4 left-4 right-4 bg-yellow-500 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg transition-all duration-300 hover:bg-yellow-400">
                                    <h1 className="text-green-900 text-3xl font-extrabold text-center font-[Comic Sans MS] transition-all duration-300">
                                        Snakes & Ladders
                                    </h1>
                                    <p className="text-green-800 text-center font-medium transition-all duration-300">Multiplayer</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center p-8 rounded-2xl transition-all duration-500">
                            <h2 className="text-green-800 text-4xl font-bold mb-8 font-[Comic Sans MS] transition-all duration-300">Ready to Play?</h2>
                            {clicked === false ? (
                                <button
                                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-xl font-bold px-12 py-6 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform -rotate-3 hover:rotate-0 border-4 border-yellow-600 relative overflow-hidden group"
                                    onClick={handleClick}>
                                    <span className="relative z-10">🎲 Play Now!</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </button>
                            ) : renderLoadingAnimation()}
                        </div>
                    </div>
                </div>
            </div>
        )}

    </>

};
