import { useEffect } from "react";
import Image from "../assets/snake-and-ladders-multiplayer.webp";
import { useSocket } from "../hooks/Socket";

export const INIT_GAME = "init_game";
export const DICE = "dice";
export const GAME_OVER = "game_over";

export const Landing = () => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case INIT_GAME:
                    console.log("init");
                    const color = message.payload.color;
                    console.log(color);
                    break;

                case DICE:
                    console.log("dice");
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
        if (!socket) {
            return;

        }
        socket.send(JSON.stringify({
            type: INIT_GAME
        }));

    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 min-h-screen p-6 bg-gradient-to-r from-orange-300 to-orange-600">
            {/* Left - Image Section */}
            <div className="p-4 rounded-2xl shadow-lg bg-yellow-300">
                <img src={Image} className="w-full h-full object-cover rounded-2xl border-4 border-yellow-400" alt="Snakes and Ladders" />
            </div>

            {/* Right - Play Now Section */}
            <div className="flex flex-col justify-center items-center bg-yellow-300 p-8 rounded-2xl shadow-lg ">
                <h2 className="text-green-900 text-3xl font-bold mb-4 font-[Comic Sans MS]">Ready to Play?</h2>
                <button className="mb-6  bg-gradient-to-r from-orange-600 to-orange-400 text-lg font-bold px-10 py-4  text-white rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl" onClick={handleClick}>
                    🎲 Play Now!
                </button>
            </div>
        </div>
    );
};
