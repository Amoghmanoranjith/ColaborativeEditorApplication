import { useAtom } from "jotai"
import { bindingAtom, editorAtom, providerAtom } from "../atoms"
import { useEffect } from "react";
import { MonacoBinding } from "y-monaco";

export function useBinding(ydoc){
    const [binding, setBinding] = useAtom(bindingAtom);
    const [editor, setEditor] = useAtom(editorAtom);
    const [provider, setProvider] = useAtom(providerAtom);
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
}