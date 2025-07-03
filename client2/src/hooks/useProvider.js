import { useAtom } from "jotai";
import { useEffect } from "react";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { WebsocketProvider } from "y-websocket";
import { providerAtom, roomNameAtom, userNameAtom } from "../atoms";

function getRandomColorHex() {
    const getChannel = () => Math.floor(Math.random() * 156) + 50; // 50–205
    const r = getChannel();
    const g = getChannel();
    const b = getChannel();
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)}`;
}

export function useProvider(ydoc) {
    const [userName, setUserName] = useAtom(userNameAtom);
    const [provider, setProvider] = useAtom(providerAtom);
    const [roomName] = useAtom(roomNameAtom);
    useEffect(() => {
        const awareness = new awarenessProtocol.Awareness(ydoc);
        const randomColor = getRandomColorHex();
        console.log("within")
        console.log(userName, randomColor, roomName);
        awareness.setLocalStateField('user', {
            userId: userName,
            color: randomColor
        });
        const provider = new WebsocketProvider('ws://localhost:8080', roomName, ydoc, { awareness: awareness })
        setProvider(provider)
        return () => {
            provider?.destroy()
            ydoc.destroy()
        }
    }, [ydoc])
}