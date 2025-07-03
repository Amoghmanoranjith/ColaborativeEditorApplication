import { useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { Awareness } from 'y-protocols/awareness.js';
import * as awarenessProtocol from 'y-protocols/awareness'
import * as encoding from 'lib0/encoding'

function App() {
    const socketRef = useRef(null);
    const [send, setSend] = useState("");
    const [receive, setReceive] = useState("See response here");
    const ydoc = useMemo(() => new Y.Doc(), [])
    const [awareness, setAwareness] = useState();
    const [editor, setEditor] = useState()
    const [ytext, setText] = useState();
    const [binding, setBinding] = useState();
    const roomName = "exp"

    // bind ytext to ydoc
    useEffect(() => {
        setText(ydoc.getText());
        return () => {
            ydoc.destroy();
        }
    }, [ydoc])

    // bind ytext to editor
    useEffect(() => {
        if (!editor) return;

        return () => {
            binding.destroy()
        }
    }, [ydoc, editor])


    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080');
        socketRef.current.onopen = () => {
            console.log("socket connection successful");
        }

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const type = data.type;
            const value = data.value;
            const incomingAwareness = data.awareness;
            if (type === 'init') {
                // input is encodedstate
                Y.applyUpdate(ydoc, new Uint8Array(value))
                awarenessProtocol.applyAwarenessUpdate(awareness, incomingAwareness, "remote");
                const awareness = new Awareness(ydoc);
                const randomUserId = `user-${Math.floor(Math.random() * 10000)}`;
                const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
                console.log("setting cursor ", randomUserId, randomColor);
                awareness.setLocalStateField('user', {
                    cursorPosition: { x: 0, y: 0 },
                    userId: randomUserId,
                    color: randomColor
                });
                setAwareness(awareness);
                const binding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness)
                setBinding(binding)
            }
            else if (type === 'update') {
                // value is statevector
                console.log("update received");
                Y.applyUpdate(ydoc, new Uint8Array(value), 'remote');
            }
            else if (type === 'awareness') {
                console.log("awareness received");
                console.log(value);
                awarenessProtocol.applyAwarenessUpdate(awareness, awarenessProtocol.encodeAwarenessUpdate(awareness, value));
            }
        }

        socketRef.current.onclose = () => {
            console.log("connection being closed");
        }

    }, [])


    useEffect(() => {
        const docHandler = (update, origin) => {
            if (origin !== 'remote') {
                // then send this update to the server
                socketRef.current.send(JSON.stringify({
                    type: "update",
                    value: Array.from(update)
                }))
            }
        }

        ydoc.on("update", docHandler);
        console.log("local document update detected");
        return () => ydoc.off("update", docHandler);
    }, [ydoc]);

    useEffect(() => {
        if (!awareness)
            return;
        const awarenessHandler = ({ added, updated, removed }, origin) => {
            if (origin !== 'remote') {
                const changedClients = added.concat(updated).concat(removed)
                const value = awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients);
                console.log()
                socketRef.current.send(JSON.stringify({
                    type: "awareness",
                    value: Array.from(value)
                }));
            }
        }
        awareness.on('update', awarenessHandler)
    }, [awareness])

    return <Editor height="90vh" defaultValue="// some comment" defaultLanguage="javascript" onMount={editor => { setEditor(editor) }} />

}

export default App
