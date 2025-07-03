import MonacoEditor from "@monaco-editor/react";
import { useAtom } from "jotai";
import { useMemo} from "react";
import { codeAtom, editorAtom, languageAtom, providerAtom, roomNameAtom, themeAtom } from "../atoms";
import * as Y from 'yjs'

import { useProvider } from "../hooks/useProvider";
import { useBinding } from "../hooks/useBinding";
import { useDecorator } from "../hooks/useDecorator";
import { usePosUpdate } from "../hooks/usePosUpdate";


export default function CodeEditor() {

    const [theme, changeTheme] = useAtom(themeAtom);
    const [language, changeLanguage] = useAtom(languageAtom);
    const ydoc = useMemo(() => new Y.Doc(), []);
    const [editor, setEditor] = useAtom(editorAtom);
    const handleEditorDidMount = (editor, monaco) => {
        setEditor(editor);
    };

    // lifecycle of provider
    useProvider(ydoc)

    // this effect manages the lifetime of the editor binding
    useBinding(ydoc);

    // setting the css for other users
    useDecorator();

    // update your own 
    usePosUpdate();

    return (
        <MonacoEditor
            height="90vh"
            width="80vw"
            theme={theme.value}
            language={language.value}
            onMount={handleEditorDidMount}
        />
    );
}

// i want this to return a code editor with a particular theme for a particular language
//