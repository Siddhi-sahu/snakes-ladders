import { useEffect, useState } from "react";

type BoardProps = {
    whitePosition: number;
    bluePosition: number;

}

export const Board = ({ whitePosition, bluePosition }: BoardProps) => {
    const [whiteToken, setWhiteToken] = useState(1);
    const [blueToken, setBlueToken] = useState(1);
    const [whiteMoving, setWhiteMoving] = useState(false);
    const [blueMoving, setBlueMoving] = useState(false);

    useEffect(() => {
        if (whitePosition !== whiteToken) {
            setWhiteMoving(true);
            const timer = setTimeout(() => {
                setWhiteToken(whitePosition);
                setWhiteMoving(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [whitePosition, whiteToken]);

    useEffect(() => {
        if (bluePosition !== blueToken) {
            setBlueMoving(true);
            const timer = setTimeout(() => {
                setBlueToken(bluePosition);
                setBlueMoving(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [bluePosition, blueToken]);
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
    const board = [
        [91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
        [81, 82, 83, 84, 85, 86, 87, 88, 89, 90],

        [71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
        [61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
        [51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],

        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ];

    const renderToken = (cell: number) => {
        return (
            <>
                {whiteToken === cell && (
                    <div className={`absolute w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-200 border-2 border-gray-300 shadow-lg z-20 flex items-center justify-center transition-all duration-300 ${whiteMoving ? 'scale-110' : 'scale-100'}`}>
                        <div className="w-4 h-4 rounded-full bg-gray-300 transition-all duration-300"></div>
                    </div>
                )}
                {blueToken === cell && (
                    <div className={`absolute w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-blue-700 shadow-lg z-20 flex items-center justify-center transition-all duration-300 ${blueMoving ? 'scale-110' : 'scale-100'}`}>
                        <div className="w-4 h-4 rounded-full bg-blue-300 transition-all duration-300"></div>
                    </div>
                )}
            </>
        );
    };

    // const renderLadder = (cell: number) => {
    //     if (!LADDERS[cell]) return null;

    //     return (
    //         <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
    //             <div className="relative w-12 h-10">
    //                 {/* Main ladder structure with gradient and subtle animation */}
    //                 <div className="absolute w-6 h-10 bg-gradient-to-b from-amber-600 to-amber-400 rounded-md opacity-80 transition-colors duration-1000 hover:from-amber-500 hover:to-amber-300"></div>

    //                 {/* Ladder rungs with subtle hover effect */}
    //                 <div className="absolute w-8 h-1.5 bg-amber-300 top-2 rounded-full transform -translate-x-1/2 left-1/2 transition-all duration-500 hover:bg-amber-200"></div>
    //                 <div className="absolute w-8 h-1.5 bg-amber-300 top-6 rounded-full transform -translate-x-1/2 left-1/2 transition-all duration-500 hover:bg-amber-200"></div>
    //             </div>
    //         </div>
    //     );
    // };

    // const renderSnake = (cell: number) => {
    //     if (!SNAKES[cell]) return null;

    //     return (
    //         <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
    //             {/* <div className="relative w-12 h-12 group"> */}
    //             🐍
    //             {/* </div> */}
    //         </div>
    //     );
    // };

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
                                         ${isEven ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-white to-amber-100"
                                            }
                                   ${cell === 100 ? "bg-gradient-radial from-yellow-300 to-yellow-500" : ""}
                                  ${getCellHighlightClass(cell)}
                                border border-amber-700 transition-all duration-300`}
                                    >



                                        {LADDERS[cell] ? "🪜" : SNAKES[cell] ? "🐍" : <span className={`text-xl font-bold ${isEven ? "text-amber-900" : "text-amber-800"} transition-all duration-300`}>
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