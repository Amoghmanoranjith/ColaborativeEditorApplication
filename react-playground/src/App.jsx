import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as awarenessProtocol from "y-protocols/awareness";

import React, { useEffect, useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'

const roomname = `monaco-react-demo-${new Date().toLocaleDateString('en-CA')}`

const injectedStyles = new Set();

function injectCursorStyle(clientId, color) {
  if (injectedStyles.has(clientId)) return;

  const style = document.createElement("style");
  style.innerHTML = `
    .yRemoteCursor-${clientId} {
      border-left: 2px solid ${color};
    }
  `;
  document.head.appendChild(style);
  injectedStyles.add(clientId);
}

function getRandomColorHex() {
  const getChannel = () => Math.floor(Math.random() * 156) + 50; // 50–205
  const r = getChannel();
  const g = getChannel();
  const b = getChannel();
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}



const broadcastMessage = (provider, buf) => {
  const ws = provider.ws
  if (provider.wsconnected && ws && ws.readyState === ws.OPEN) {
    ws.send(buf)
  }
}

function App() {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const [editor, setEditor] = useState(null)
  const [provider, setProvider] = useState(null)
  const [binding, setBinding] = useState(null)
  // const [awareness, setAwareness] = useState<Awareness|null>(null)
  // this effect manages the lifetime of the Yjs document and the provider
  useEffect(() => {
    const awareness = new awarenessProtocol.Awareness(ydoc);
    const randomUserId = `user-${Math.floor(Math.random() * 10000)}`;
    const randomColor = getRandomColorHex();
    awareness.setLocalStateField('user', {
      userId: randomUserId,
      color: randomColor
    });
    const provider = new WebsocketProvider('ws://localhost:8080', roomname, ydoc, { awareness: awareness })

    setProvider(provider)
    return () => {
      provider?.destroy()
      ydoc.destroy()
    }
  }, [ydoc])

  // this effect manages the lifetime of the editor binding
  useEffect(() => {
    if (provider === null || editor === null || editor.getModel() === null) {
      return
    }
    console.log('reached', provider)

    const binding = new MonacoBinding(ydoc.getText('monaco'), editor.getModel(), new Set([editor]), provider?.awareness)
    setBinding(binding)
    return () => {
      binding.destroy()
    }
  }, [ydoc, provider, editor])

  useEffect(() => {
    if (!editor || !provider) return;

    const awareness = provider.awareness;
    const myClientId = awareness.clientID;

    let decorationIds = [];

    const renderRemoteCursors = () => {
      const states = awareness.getStates();
      const decorations = [];

      for (const [clientId, state] of states.entries()) {
        if (clientId === myClientId) continue; // skip own cursor

        const { cursor, user } = state;
        if (!cursor || !user) continue;

        injectCursorStyle(clientId, user.color);

        decorations.push({
          range: new monaco.Range(cursor.lineNumber, cursor.column, cursor.lineNumber, cursor.column),
          options: {
            className: `yRemoteCursor-${clientId}`,
          }
        });
      }

      decorationIds = editor.deltaDecorations(decorationIds, decorations);
    };

    awareness.on('change', renderRemoteCursors);

    return () => {
      awareness.off('change', renderRemoteCursors);
      decorationIds = editor.deltaDecorations(decorationIds, []); // clear
    };
  }, [editor, provider]);

  useEffect(() => {
    if (!editor || !provider) return;

    const awareness = provider.awareness;

    const updateCursorPosition = () => {
      const position = editor.getPosition(); // { lineNumber, column }
      if (position) {
        awareness.setLocalStateField('cursor', {
          lineNumber: position.lineNumber,
          column: position.column
        });
      }
    };

    const disposable = editor.onDidChangeCursorPosition(() => {
      updateCursorPosition();
    });

    updateCursorPosition(); // initialize once

    return () => {
      disposable.dispose();
    };
  }, [editor, provider]);


  return <Editor height="90vh" defaultValue="// some comment" defaultLanguage="javascript" onMount={editor => { setEditor(editor) }} />
}

export default App