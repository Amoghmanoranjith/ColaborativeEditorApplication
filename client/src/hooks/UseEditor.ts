// src/hooks/useEditor.ts
import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness.js";
import { initSocket } from "../socket";

export function useEditor(roomId: string) {
  const ydocRef = useRef(new Y.Doc());
  const ytextRef = useRef(ydocRef.current.getText("monaco"));
  const awarenessRef = useRef(new Awareness(ydocRef.current));
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    
    const ws = initSocket("ws://localhost:8082");
    socketRef.current = ws;
    // send join request upon connection
    ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({
          type: "join",
          payload: { token : localStorage.getItem('token')}
        }));
      };

    // handle incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "changes") {
        const update = new Uint8Array(data.payload.update);
        Y.applyUpdate(ydocRef.current, update);
      } else if (data.type === "ack") {
        console.log("Server:", data.payload.message);
      } else if (data.type === "error") {
        console.error(data.payload.error);
      }
    };

    // handle updates to the doc
    ydocRef.current.on("update", (update: Uint8Array) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "changes",
          payload: {
            update: Array.from(update),
            roomId
          }
        }));
      }
    });

    // for 
    const handleBeforeUnload = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "disconnect",
          payload: { roomId }
        }));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      ws.close();
      awarenessRef.current.destroy();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

  return {
    ydoc: ydocRef.current,
    ytext: ytextRef.current,
    awareness: awarenessRef.current,
  };
}
