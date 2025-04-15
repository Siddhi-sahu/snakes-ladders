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

            const ladderEntry = Object.entries(LADDERS).find(([end]) => Number(end) === whitePosition);
            const snakeEntry = Object.entries(SNAKES).find(([end]) => Number(end) === whitePosition);

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

            const ladderEntry = Object.entries(LADDERS).find(([end]) => Number(end) === bluePosition);
            const snakeEntry = Object.entries(SNAKES).find(([end]) => Number(end) === whitePosition);

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
        [100, 99, 98, 97, 96, 95, 94, 93, 92, 91],
        [81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
        [80, 79, 78, 77, 76, 75, 74, 73, 72, 71],
        [61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
        [60, 59, 58, 57, 56, 55, 54, 53, 52, 51],
        [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        [40, 39, 38, 37, 36, 35, 34, 33, 32, 31],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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

    const isLadderStart = (cell: number) => Object.keys(LADDERS).map(Number).includes(cell);
    const isLadderEnd = (cell: number) => Object.values(LADDERS).includes(cell);
    const isSnakeStart = (cell: number) => Object.keys(SNAKES).map(Number).includes(cell);
    const isSnakeEnd = (cell: number) => Object.values(SNAKES).includes(cell);

    const getCellBaseColor = (cell: number, isEven: boolean) => {
        if (isLadderStart(cell)) return "bg-green-200";
        if (isLadderEnd(cell)) return "bg-green-100";
        if (isSnakeStart(cell)) return "bg-red-200";
        if (isSnakeEnd(cell)) return "bg-red-100";
        return isEven ? "bg-amber-400" : "bg-amber-50";
    };

    return (
        <div className="flex justify-center items-center">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-600">
                <div className="bg-amber-100">
                    {board.map((row, rowIndex) => (
                        <div className="flex" key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                const isEven = cell % 2 === 0;

                                return (
                                    <div
                                        key={cellIndex}
                                        className={`relative flex justify-center items-center w-16 h-16 
                                        ${getCellBaseColor(cell, isEven)}
                                        border border-amber-700 transition-all duration-300`}
                                    >
                                        <span className={`text-xl font-bold ${isEven ? "text-amber-900" : "text-amber-800"}`}>
                                            {cell}
                                        </span>

                                        {isLadderStart(cell) && (
                                            <div className="absolute top-0 right-0 p-1">
                                                <span className="text-xs text-green-700 font-bold">↑{LADDERS[cell]}</span>
                                            </div>
                                        )}

                                        {isLadderEnd(cell) && (
                                            <div className="absolute bottom-0 left-0 p-1">
                                                <span className="text-xs text-green-700 font-bold">
                                                    {Object.keys(LADDERS).find(key => LADDERS[Number(key)] === cell)}↑
                                                </span>
                                            </div>
                                        )}

                                        {isSnakeStart(cell) && (
                                            <div className="absolute top-0 right-0 p-1">
                                                <span className="text-xs text-red-700 font-bold">↓{SNAKES[cell]}</span>
                                            </div>
                                        )}

                                        {isSnakeEnd(cell) && (
                                            <div className="absolute bottom-0 left-0 p-1">
                                                <span className="text-xs text-red-700 font-bold">
                                                    {Object.keys(SNAKES).find(key => SNAKES[Number(key)] === cell)}↓
                                                </span>
                                            </div>
                                        )}

                                        {isLadderStart(cell) && <img src={ladder} alt="ladder" className="absolute opacity-50" />}
                                        {isSnakeStart(cell) && <img src={snake} alt="snake" className="absolute opacity-50" />}

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