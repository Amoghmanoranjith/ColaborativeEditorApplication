import { Copy } from "lucide-react"; // or any other copy icon you use
import { useState } from "react";
import { useAtom } from "jotai";
import { roomNameAtom } from "../atoms";

export default function RoomInfoBar() {
    const [roomName] = useAtom(roomNameAtom); // or from location.state.roomId
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomName);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-800 font-medium text-sm truncate">{roomName}</span>
            <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-sm border border-black-300 rounded hover:bg-gray-100 transition"
            >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy"}
            </button>
        </div>
    );
}
