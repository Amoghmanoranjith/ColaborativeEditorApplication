import Editor, { OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import { MonacoBinding } from 'y-monaco';
import { useEditor } from '../hooks/UseEditor';


function ColaborativeEditor() {
  const { ydoc, ytext, awareness } = useEditor("1");
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    awareness.setLocalStateField("user", {
      name: "User" + Math.floor(Math.random() * 1000),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    });

    editorRef.current = editor;
    const model = editor.getModel();
    if (!model) {
      console.error("model is not defined in editor");
      return;
    }

    new MonacoBinding(ytext, model, new Set([editor]), awareness);
  };

  return (
    <Editor
      height="90vh"
      width="100vw"
      defaultLanguage="javascript"
      theme="vs-dark"
      onMount={handleEditorDidMount}
    />
  );
}

export default ColaborativeEditor;
