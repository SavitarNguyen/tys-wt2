import { useAtom } from "jotai";
import {
  instructionNamesAtom,
  isIELTSModeAtom,
  loadingAtom,
  refinedAtom,
  resultAtom,
  textAtom,
} from "../atoms";
import { compareStrings } from "../utils";

export function useRefine() {
  const [text] = useAtom(textAtom);
  const [instructionNames] = useAtom(instructionNamesAtom);
  const [, setLoading] = useAtom(loadingAtom);
  const [, setResult] = useAtom(resultAtom);
  const [, setRefined] = useAtom(refinedAtom);
  const [, setIsIELTSMode] = useAtom(isIELTSModeAtom);

  return async function refine() {
    if (text.trim().length === 0) {
      setRefined("");
      setResult([]);
      setIsIELTSMode(false);
      return;
    }
    setResult([]);
    setLoading(true);
    
    // Check if IELTS mode is active
    const isIELTS = instructionNames.includes("ielts");
    setIsIELTSMode(isIELTS);
    
    const result = await fetch("api/v1/refine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, instructionNames }),
    });
    const localRefined = (await result.json())["refined"];
    setRefined(localRefined);
    
    // For IELTS mode, we'll handle the rendering in RefinedArea
    // For regular mode, use diff view
    if (!isIELTS) {
      setResult(compareStrings(text, localRefined));
    } else {
      // For IELTS mode, set empty result since we'll render from refinedAtom
      setResult([]);
    }
    setLoading(false);
  };
}
