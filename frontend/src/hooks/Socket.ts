import { useEffect, useState } from "react"

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
export const useSocket = () => {
    const [socket, setSocket] = useState<null | WebSocket>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        //connection
        ws.onopen = () => {
            setSocket(ws)

        }

        //disconnection
        ws.onclose = () => {
            setSocket(null)
        }

        return () => {
            //on component unmount close the connection to the websoket server
            ws.close();
        }

    }, []);

    return socket;
}

