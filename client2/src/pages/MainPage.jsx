import ThemeChanger from "./ThemeChanger";
import CodeEditor from "./CodeEditor";
import LanguageChanger from "./LanguageChanger";
import BackgroundBlob from "./BackgroundBlob";
import { CustomInput } from "./CustomInput";
import { ResultOutput } from "./ResultOutput";
import { handleCompile } from "../lib/handleCompile";
import { useAtom } from "jotai";
import { codeAtom, languageAtom, outputAtom, roomNameAtom, stdinAtom, userNameAtom } from "../atoms";
import { handleStatus } from "../lib/handleStatus";
import { useEffect, useState } from "react";
import RoomInfoBar from "./RoomInfoBar";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const [output, setOutput] = useAtom(outputAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const [code, setCode] = useAtom(codeAtom);
  const [stdin, setStdin] = useAtom(stdinAtom);
  const [token, setToken] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [roomName, setRoomName] = useAtom(roomNameAtom);
  const navigate = useNavigate();
  useEffect(() => {
    if (!roomName) {
      navigate('/');
    }
  }, [])

  useEffect(() => {
    if (!processing)
      return;
    setTimeout(() => {
      console.log(token);
      const response = handleStatus(token);
      response.then(result => {
        const data = result.data;
        setStatusId(data.status_id);
        if (data.status_id === 3) {
          setOutput(atob(data.stdout));
          setProcessing(false)
        }
        else if (data.status_id !== 1 && data.status_id !== 2) {
          setOutput(atob(data.stderr));
          setProcessing(false);
        }
      })
    }, 2000);
  }, [processing])

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-4 pt-2 pl-4">
        <ThemeChanger />
        <RoomInfoBar />
        {language.value}
      </div>

      <div className="pt-2 pl-3 flex justify-between items-start gap-2">
        <div className="flex-1">
          <CodeEditor />
        </div>

        <div className="flex flex-col gap-4 w-80 pr-2">
          <CustomInput />
          <ResultOutput />
          <button
            className="w-full h-9 px-4 py-1.5 rounded-md bg-white border border-gray-300 text-black font-lexend transition-all duration-200 ease-in-out hover:border-black hover:shadow-[0_0_0_2px_black] hover:scale-[1.02]"
            onClick={() => {
              const response = handleCompile(language, code, stdin);
              // send the code and stdin for compiler
              response.then(result => {
                const data = result.data
                const token = data.token, status = result.status;
                if (status === 200 || status === 201) {
                  setToken(token);
                  setProcessing(true);
                }
                else {
                  // handle other cases
                  console.log(status)
                }
              }).catch(error => { throw error; })
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
