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
    const [color, setColor] = useState(null);
    const [lastPlayed, setLastPlayed] = useState(null);
    const [whitePosition, setWhitePosition] = useState(1);
    const [bluePosition, setBluePosition] = useState(1);
    const diceUnicode = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const [diceFace, setDiceFace] = useState("⚀");
    const [diceRolling, setDiceRolling] = useState(false);
    const [winner, setWinner] = useState(null);
    const [currentTurn, setCurrentTurn] = useState("white");
    const [showConfetti, setShowConfetti] = useState(false);
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
                    setShowConfetti(true);
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
            console.log("no socket during handlediceclick or not your turn or dice already rolling")
            return;
        }

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
                    ${yourTurn && !diceRolling ? 'cursor-pointer hover:scale-110 hover:rotate-12 hover:shadow-xl' : ''}
                `}>
                    {diceFace}
                </div>
                {yourTurn && !diceRolling && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-xl blur opacity-40 -z-10 animate-pulse"></div>
                )}
            </div>
        );
    };

    const renderConfetti = () => {
        return (
            <div className="confetti-container">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            backgroundColor: ['#FCD34D', '#F59E0B', '#D97706', '#4ADE80', '#22C55E', '#16A34A'][Math.floor(Math.random() * 6)]
                        }}
                    ></div>
                ))}
            </div>
        );
    };

    const renderLoadingAnimation = () => {
        return (
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-8 border-amber-300 border-t-amber-600 animate-spin"></div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-transparent border-b-amber-600 animate-spin animation-delay-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl animate-bounce">🎲</div>
                    </div>
                </div>
                <div className="text-green-800 text-xl font-bold">
                    Finding players...
                </div>
                <div className="text-green-800 text-lg px-4 py-2 bg-yellow-100 bg-opacity-50 rounded-lg shadow-inner">
                    <span className="inline-block">Open in two tabs to simulate two players and reload this page again</span>
                </div>
            </div>
        );
    };

    return <>
        <style>{`
            @keyframes dotsRise {
                0% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0); }
            }
            
            .dots-wrapper {
                display: flex;
                position: absolute;
                left: 0;
                gap: 6px;
            }
            
            .dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                background-color: #166534;
                border-radius: 50%;
                opacity: 0.8;
                animation: dotsRise 1.4s infinite ease-in-out;
            }
            
            .dot:nth-child(1) {
                animation-delay: 0s;
            }
            
            .dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(5deg); }
                100% { transform: translateY(0px) rotate(0deg); }
            }
            
            .float-animation {
                animation: float 6s ease-in-out infinite;
            }
            
            .float-animation-delay {
                animation: float 7s ease-in-out infinite;
                animation-delay: 1s;
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
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fadeIn {
                animation: fadeIn 1s ease-in;
            }
            
            @keyframes glow {
                0% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.5), 0 0 15px rgba(245, 158, 11, 0.3); }
                50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.8), 0 0 30px rgba(245, 158, 11, 0.5); }
                100% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.5), 0 0 15px rgba(245, 158, 11, 0.3); }
            }
            
            .glow-animation {
                animation: glow 2s infinite ease-in-out;
            }
            
            @keyframes confettiFall {
                0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            
            .confetti-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                pointer-events: none;
                z-index: 100;
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 2px;
                opacity: 0.7;
                animation: confettiFall 5s linear infinite;
            }
            
            .dice-shadow {
                filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.3));
            }
            
            @keyframes bgShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .bg-shift {
                background-size: 200% 200%;
                animation: bgShift 15s ease infinite;
            }
        `}</style>

        {started ? (
            <div className="flex justify-center items-center bg-gradient-to-b from-green-900 via-green-800 to-amber-900 min-h-screen p-6 bg-shift">
                {showConfetti && winner === color && renderConfetti()}

                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 text-5xl float-animation">🌼</div>
                    <div className="absolute top-20 right-20 text-5xl float-animation-delay">🌿</div>
                    <div className="absolute bottom-10 left-32 text-5xl float-animation">🌼</div>
                    <div className="absolute bottom-40 right-10 text-5xl float-animation-delay">🌿</div>
                    <div className="absolute top-64 left-1/4 text-5xl float-animation">🌿</div>
                    <div className="absolute bottom-20 right-1/4 text-5xl float-animation-delay">🌼</div>
                    <div className="absolute top-1/3 right-1/3 text-4xl float-animation">🦋</div>
                    <div className="absolute bottom-1/3 left-1/3 text-4xl float-animation-delay">🐝</div>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-center items-center gap-8 w-full max-w-6xl z-10">
                    <div className="w-full lg:w-3/5 transform transition-all duration-500">
                        <div className="bg-gradient-to-br from-yellow-600 to-amber-700 p-6 rounded-xl shadow-2xl border-4 border-yellow-600 transition-all duration-500 hover:shadow-amber-600/20 glow-animation">
                            <h2 className="text-white text-center text-3xl font-bold mb-4 font-[Comic Sans MS] drop-shadow-md">
                                <span className="inline-block animate-bounce animation-delay-300">🐍</span>
                                Snakes & Ladders
                                <span className="inline-block animate-bounce animation-delay-600">🪜</span>
                            </h2>
                            <Board whitePosition={whitePosition} bluePosition={bluePosition} />
                        </div>
                    </div>

                    {!winner && (
                        <div className="w-full lg:w-2/5 flex flex-col items-center transform transition-all duration-500">
                            <div className={`${color === "white" ? "text-white" : "text-blue-300"} font-bold text-3xl mb-6 drop-shadow-md transition-all duration-300 bg-amber-900 bg-opacity-50 px-6 py-2 rounded-full backdrop-blur-sm`}>
                                You are {color}
                            </div>

                            <div className="bg-amber-100 bg-opacity-20 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-amber-400 border-opacity-30 transition-all duration-500 hover:shadow-amber-500/30">
                                <div className="flex justify-center mb-6 dice-shadow">
                                    {renderDice()}
                                </div>

                                <button
                                    disabled={!yourTurn}
                                    onClick={handleDiceClick}
                                    className={`w-full py-4 px-6 rounded-xl text-xl font-bold transition-all duration-300
                                            ${!yourTurn
                                            ? "bg-amber-500 bg-opacity-50 cursor-not-allowed"
                                            : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:scale-105"
                                        } text-amber-900`}>
                                    {diceRolling ? "Rolling..." : yourTurn ? "Your Turn - Roll!" : "Waiting for opponent..."}
                                </button>

                                <div className="text-center mt-6">
                                    <span className="bg-amber-900 bg-opacity-70 text-amber-100 px-6 py-3 rounded-full inline-block shadow transition-all duration-300 hover:bg-amber-800">
                                        Turn: <span className={`font-bold ${currentTurn === "white" ? "text-white" : "text-blue-300"} transition-colors duration-300`}>
                                            {currentTurn}
                                        </span>
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-amber-900 bg-opacity-40 p-3 rounded-lg text-center">
                                        <div className="text-white text-lg">White</div>
                                        <div className="text-amber-200 font-bold text-2xl">{whitePosition}/100</div>
                                    </div>
                                    <div className="bg-amber-900 bg-opacity-40 p-3 rounded-lg text-center">
                                        <div className="text-blue-300 text-lg">Blue</div>
                                        <div className="text-amber-200 font-bold text-2xl">{bluePosition}/100</div>
                                    </div>
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
                                <div className={`text-3xl text-center font-bold mb-6 ${winner === color ? "text-yellow-300" : "text-amber-200"} transition-all duration-500`}>
                                    {winner === color
                                        ? "Congratulations! You Won! 🎉"
                                        : "Better luck next time! 🍀"
                                    }
                                </div>

                                <div className="text-center mb-6 text-amber-100">
                                    Final Score: White {whitePosition}/100 • Blue {bluePosition}/100
                                </div>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-4 px-6 rounded-xl text-xl font-bold transition-all duration-300
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
            <div className="min-h-screen bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 p-6 transition-all duration-1000 bg-shift">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-yellow-300 p-6 rounded-3xl shadow-2xl border-4 border-yellow-500 transition-all duration-500 hover:shadow-yellow-600/30">
                        <div className="p-4 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-green-100 to-amber-100 transition-all duration-500 hover:shadow-inner">
                            <div className="relative">
                                <img src={Image} className="w-full h-full object-cover rounded-xl border-4 border-yellow-500 transition-transform duration-700 hover:scale-105" alt="Snakes and Ladders" />
                                <div className="absolute bottom-4 left-4 right-4 bg-yellow-500 bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg transition-all duration-300 hover:bg-yellow-400">
                                    <h1 className="text-green-900 text-3xl font-extrabold text-center font-[Comic Sans MS] transition-all duration-300">
                                        <span className="inline-block mr-2 transform -rotate-12 hover:rotate-0 transition-all duration-300">🐍</span>
                                        Snakes & Ladders
                                        <span className="inline-block ml-2 transform rotate-12 hover:rotate-0 transition-all duration-300">🪜</span>
                                    </h1>
                                    <p className="text-green-800 text-center font-medium transition-all duration-300">Multiplayer Adventure</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center p-8 rounded-2xl transition-all duration-500">
                            <h2 className="text-green-800 text-4xl font-bold mb-8 font-[Comic Sans MS] transition-all duration-300">Ready for Adventure?</h2>
                            {clicked === false ? (
                                <button
                                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-2xl font-bold px-12 py-6 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl transform -rotate-3 hover:rotate-0 border-4 border-yellow-600 relative overflow-hidden group"
                                    onClick={handleClick}>
                                    <span className="relative z-10">🎲 Play Now!</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </button>
                            ) : renderLoadingAnimation()}

                            {!clicked && (
                                <div className="mt-8 text-green-700 bg-yellow-100 p-4 rounded-lg shadow-inner text-center">
                                    <p className="text-lg">Challenge friends and climb to victory!</p>
                                    <p className="text-sm mt-2">Avoid the snakes, find the ladders, and be the first to reach 100!</p>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>;
};