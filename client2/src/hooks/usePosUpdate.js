import { useAtom } from "jotai";
import { editorAtom, providerAtom } from "../atoms";
import { useEffect } from "react";

export function usePosUpdate() {
    const [editor, setEditor] = useAtom(editorAtom);
    const [provider, setProvider] = useAtom(providerAtom);
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
}