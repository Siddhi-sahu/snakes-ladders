import { useEffect, useState } from "react";
import snake from "../assets/snake.svg";
import ladder from "../assets/ladder.svg";

type BoardProps = {
    whitePosition: number;
    bluePosition: number;
}

export const Board = ({ whitePosition, bluePosition }: BoardProps) => {
    const [whiteToken, setWhiteToken] = useState(1);
    const [blueToken, setBlueToken] = useState(1);
    const [whiteMoving, setWhiteMoving] = useState(false);
    const [blueMoving, setBlueMoving] = useState(false);
    const [whiteMoveType, setWhiteMoveType] = useState<"normal" | "snake" | "ladder">("normal");
    const [blueMoveType, setBlueMoveType] = useState<"normal" | "snake" | "ladder">("normal");

    const LADDERS: Record<number, number> = {
        4: 14,
        9: 31,
        21: 42,
        28: 84,
        51: 67,
        71: 91,
        80: 99
    }

    const SNAKES: Record<number, number> = {
        16: 6,
        49: 11,
        62: 19,
        65: 53,
        87: 24,
        95: 75,
        98: 78
    }

    useEffect(() => {
        if (whitePosition !== whiteToken) {
            setWhiteMoving(true);

            // Check if this is a snake or ladder destination
            const ladderEntry = Object.entries(LADDERS).find(([start, end]) => Number(end) === whitePosition);
            const snakeEntry = Object.entries(SNAKES).find(([start, end]) => Number(end) === whitePosition);

            if (ladderEntry && Number(ladderEntry[0]) === whiteToken) {
                setWhiteMoveType("ladder");
            } else if (snakeEntry && Number(snakeEntry[0]) === whiteToken) {
                setWhiteMoveType("snake");
            } else {
                setWhiteMoveType("normal");
            }

            const timer = setTimeout(() => {
                setWhiteToken(whitePosition);
                setWhiteMoving(false);

                // Reset move type after a delay
                if (whiteMoveType !== "normal") {
                    const resetTimer = setTimeout(() => {
                        setWhiteMoveType("normal");
                    }, 1000);
                    return () => clearTimeout(resetTimer);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [whitePosition, whiteToken]);

    useEffect(() => {
        if (bluePosition !== blueToken) {
            setBlueMoving(true);

            // Check if this is a snake or ladder destination
            const ladderEntry = Object.entries(LADDERS).find(([start, end]) => Number(end) === bluePosition);
            const snakeEntry = Object.entries(SNAKES).find(([start, end]) => Number(end) === bluePosition);

            if (ladderEntry && Number(ladderEntry[0]) === blueToken) {
                setBlueMoveType("ladder");
            } else if (snakeEntry && Number(snakeEntry[0]) === blueToken) {
                setBlueMoveType("snake");
            } else {
                setBlueMoveType("normal");
            }

            const timer = setTimeout(() => {
                setBlueToken(bluePosition);
                setBlueMoving(false);

                // Reset move type after a delay
                if (blueMoveType !== "normal") {
                    const resetTimer = setTimeout(() => {
                        setBlueMoveType("normal");
                    }, 1000);
                    return () => clearTimeout(resetTimer);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [bluePosition, blueToken]);

    const board = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        [51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        [61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
        [71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
        [81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
        [91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    ];

    const renderToken = (cell: number) => {
        return (
            <>
                {whiteToken === cell && (
                    <div className={`absolute w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-200 
                        ${whiteMoveType === "ladder" ? "border-2 border-green-500 shadow-green-500 animate-pulse" :
                            whiteMoveType === "snake" ? "border-2 border-red-500 shadow-red-500 animate-pulse" :
                                "border-2 border-gray-300"} 
                        shadow-lg z-20 flex items-center justify-center transition-all duration-300 
                        ${whiteMoving ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-4 h-4 rounded-full 
                            ${whiteMoveType === "ladder" ? "bg-green-300" :
                                whiteMoveType === "snake" ? "bg-red-300" :
                                    "bg-gray-300"} 
                            transition-all duration-300`}>
                        </div>
                    </div>
                )}
                {blueToken === cell && (
                    <div className={`absolute w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 
                        ${blueMoveType === "ladder" ? "border-2 border-green-500 shadow-green-500 animate-pulse" :
                            blueMoveType === "snake" ? "border-2 border-red-500 shadow-red-500 animate-pulse" :
                                "border-2 border-blue-700"} 
                        shadow-lg z-20 flex items-center justify-center transition-all duration-300 
                        ${blueMoving ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-4 h-4 rounded-full 
                            ${blueMoveType === "ladder" ? "bg-green-300" :
                                blueMoveType === "snake" ? "bg-red-300" :
                                    "bg-blue-300"} 
                            transition-all duration-300`}>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const getCellHighlightClass = (cell: number) => {
        if (cell === 1) return "hover:bg-green-100 transition-colors duration-300";
        if (cell === 100) return "hover:bg-yellow-300 transition-colors duration-300";
        if (LADDERS[cell]) return "hover:bg-amber-300 transition-colors duration-300";
        if (SNAKES[cell]) return "hover:bg-red-100 transition-colors duration-300";
        return "hover:opacity-90 transition-opacity duration-300";
    };

    return (
        <div className="flex justify-center items-center">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-600">
                <div className="bg-gradient-to-br from-amber-100 to-amber-300">
                    {board.map((row, rowIndex) => (
                        <div className="flex" key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                const isEven = cell % 2 === 0;

                                return (
                                    <div
                                        key={cellIndex}
                                        className={`relative flex justify-center items-center w-16 h-16 
                                         ${isEven ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-white to-amber-100"}
                                         ${cell === 100 ? "bg-gradient-radial from-yellow-300 to-yellow-500" : ""}
                                         ${getCellHighlightClass(cell)}
                                         border border-amber-700 transition-all duration-300`}
                                    >
                                        {LADDERS[cell] ? <img src={ladder} alt="ladder" /> :
                                            SNAKES[cell] ? <img src={snake} alt="snake" /> :
                                                <span className={`text-xl font-bold ${isEven ? "text-amber-900" : "text-amber-800"} transition-all duration-300`}>
                                                    {cell}
                                                </span>}

                                        <div className="absolute inset-0 flex justify-center items-center">
                                            {renderToken(cell)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};