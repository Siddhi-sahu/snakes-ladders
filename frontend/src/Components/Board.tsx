import { useEffect, useState } from "react";

type BoardProps = {
    whitePosition: number;
    bluePosition: number;

}

export const Board = ({ whitePosition, bluePosition }: BoardProps) => {
    const [whiteToken, setWhiteToken] = useState(1);
    const [blueToken, setBlueToken] = useState(1);

    useEffect(() => {
        setWhiteToken(whitePosition);
        setBlueToken(bluePosition)

    }, [whitePosition, bluePosition])
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


    return <div className="flex justify-center items-center  border-b-2">

        <div className="bg-black mt-1.5 ">
            <div>

                {board.map((row, index) => (
                    //rows
                    <div className="flex justify-center items-center border-l-2 border-t-2  " key={index}>

                        {row.map((cell, index) =>
                            //individual cols
                            <div key={index} className={` flex  justify-center items-center border-r-2 w-16 h-16 ${cell % 2 === 0 ? "bg-yellow-500" : "bg-pink-500"}`} >
                                <div className="text-white font-bold">
                                    {LADDERS[cell] ? "🪜" : SNAKES[cell] ? "🐍" : cell}
                                    {whiteToken === cell ? "⚪" : ""}
                                    {blueToken === cell ? "🔵" : ""}
                                </div>

                            </div>)}
                    </div>

                ))}

            </div>


        </div>
        {/* <div className="flex bg-white m-1">
            dice

        </div> */}
    </div>
}