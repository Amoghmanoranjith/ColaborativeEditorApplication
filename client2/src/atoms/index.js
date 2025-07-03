import {atom} from 'jotai'

const themeAtom = atom({
    value: "amy",
    label: "Amy",
    key: "amy"
});
const languageAtom = atom({
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript"
});
const userNameAtom = atom("")
const codeAtom = atom('');
const providerAtom = atom(null);
const roomNameAtom = atom("");
const bindingAtom = atom(null);
const editorAtom = atom(null);
const stdinAtom = atom("");
const outputAtom = atom("")
export {themeAtom, languageAtom, userNameAtom, codeAtom, providerAtom, roomNameAtom, bindingAtom, editorAtom, stdinAtom, outputAtom}