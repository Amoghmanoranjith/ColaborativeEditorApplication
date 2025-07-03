import { useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { Awareness } from 'y-protocols/awareness.js';
import * as awarenessProtocol from 'y-protocols/awareness'

function App() {
  const socketRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText(), [ydoc]);
  const awareness = useMemo(() => new Awareness(ydoc), []);
  const [binding, setBinding] = useState(null);

  // Editor + Awareness + Binding
  useEffect(() => {
    if (!editor) return;

    const randomUserId = `user-${Math.floor(Math.random() * 10000)}`;
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

    awareness.setLocalStateField('user', {
      cursorPosition: { x: 0, y: 0 },
      userId: randomUserId,
      color: randomColor
    });

    const binding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness);
    setBinding(binding);

    return () => {
      binding.destroy();
    };
  }, [editor, ytext, awareness]);

  useEffect(() => {
    if (!binding) return;

    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.onopen = () => console.log("socket connection successful");

    socket.onmessage = (event) => {
      const { type, value, awareness: incomingAwareness } = JSON.parse(event.data);
      console.log(type, value);
      if (type === "init") {
        console.log("init received")
        Y.applyUpdate(ydoc, new Uint8Array(value));
        awarenessProtocol.applyAwarenessUpdate(awareness, new Uint8Array(incomingAwareness));
      } else if (type === "updateDoc") {
        console.log("update received");
        Y.applyUpdate(ydoc, new Uint8Array(value), 'remote');
      }
    };

    socket.onclose = () => console.log("connection being closed");

    return () => socket.close();
  }, [binding, awareness, ydoc]);

  useEffect(() => {
    const docHandler = (update, origin) => {
      if (origin !== 'remote') {
        console.log("local document update detected");
        socketRef.current?.send(JSON.stringify({
          type: "updateDoc",
          value: Array.from(update)
        }));
      }
    };
    ydoc.on("update", docHandler);
    return () => ydoc.off("update", docHandler);
  }, [ydoc]);

  return (
    <Editor
      height="90vh"
      defaultValue="// some comment"
      defaultLanguage="javascript"
      onMount={(editor) => setEditor(editor)}
    />
  );
}


export default App
// first mount editor, then bindings and stuff, then socketconnect and send receive stuff
