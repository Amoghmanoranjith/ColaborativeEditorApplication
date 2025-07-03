import { useAtom } from "jotai";
import { useEffect } from "react";
import { editorAtom, providerAtom } from "../atoms";
import * as monaco from "monaco-editor";

const injectedStyles = new Set();

function injectCursorStyle(clientId, color, userId) {
    if (injectedStyles.has(clientId)) return;

    const style = document.createElement("style");
    style.innerHTML = `
    .yRemoteSelection-${clientId} {
      background-color: ${color};
    }
    .yRemoteSelectionHead-${clientId} {
      position: absolute;
      border-left: ${color} solid 2px;
      border-top: ${color} solid 2px;
      border-bottom: ${color} solid 2px;
      height: 100%;
      box-sizing: border-box;
    }
    .yRemoteSelectionHead-${clientId}::after {
      position: absolute;
      content: "${userId}";
      border: 1px solid ${color};
      border-radius: 4px;
      left: -2px;
      top: -5px;
      font-size: 10px;
      transform: translateY(-100%);  /* Ensures it's visually "above" */
  z-index: 100;
    }
    .yRemoteCursor-${clientId} {
      border-left: 2px solid ${color};
    }
  `;
    document.head.appendChild(style);
    injectedStyles.add(clientId);
}

export function useDecorator() {
    const [editor] = useAtom(editorAtom);
    const [provider] = useAtom(providerAtom);

    useEffect(() => {
        if (!editor || !provider) return;

        const awareness = provider.awareness;
        const myClientId = awareness.clientID;
        let decorationIds = [];

        const renderRemoteCursors = () => {
            const states = awareness.getStates();
            const decorations = [];

            for (const [clientId, state] of states.entries()) {
                if (clientId === myClientId) continue;

                const { cursor, user } = state;
                if (!cursor || !user) continue;

                injectCursorStyle(clientId, user.color, user.userId);
                decorations.push({
                    range: new monaco.Range(cursor.lineNumber, cursor.column, cursor.lineNumber, cursor.column),
                    options: {
                        className: `yRemoteCursor-${clientId}`,
                    }
                });
            }

            decorationIds = editor.deltaDecorations(decorationIds, decorations);
        };

        awareness.on("change", renderRemoteCursors);

        return () => {
            awareness.off("change", renderRemoteCursors);
            decorationIds = editor.deltaDecorations(decorationIds, []);
        };
    }, [editor, provider]);
}
