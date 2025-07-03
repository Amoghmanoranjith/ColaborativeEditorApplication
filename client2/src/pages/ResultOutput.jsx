import { useAtom } from "jotai";
import { outputAtom } from "../atoms";

export function ResultOutput() {
  const [output, setOutput]= useAtom(outputAtom);
  return (
    <textarea
      name="resultOutput"
      placeholder={"output here!"}
      className="w-full h-50 p-2 border-2 border-gray-400 rounded resize-none focus:outline-none focus:border-blue-500"
      value={output}
    />
  );
}
