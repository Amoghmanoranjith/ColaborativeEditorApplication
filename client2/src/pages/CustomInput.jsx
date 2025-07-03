import { useAtom } from "jotai";
import { stdinAtom } from "../atoms";

export function CustomInput() {
  const [stdin, setStdin] = useAtom(stdinAtom);
  return (
    <textarea
      name="customInput"
      placeholder={"input here!"}
      value={stdin}
      className="w-full h-50 p-2 border-2 border-gray-400 rounded resize-none focus:outline-none focus:border-blue-500"
      onChange={(event)=>{
        setStdin(event.target.value);
      }}
    />
  );
}
