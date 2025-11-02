import { useAtom } from "jotai";
import {
  instructionNamesAtom,
  isIELTSModeAtom,
  loadingAtom,
  refinedAtom,
  resultAtom,
  textAtom,
  ieltsFeedbackAtom,
} from "../atoms";
import { compareStrings } from "../utils";
import { IELTSFeedback } from "@/lib/types/ielts";

export function useRefine() {
  const [text] = useAtom(textAtom);
  const [instructionNames] = useAtom(instructionNamesAtom);
  const [, setLoading] = useAtom(loadingAtom);
  const [, setResult] = useAtom(resultAtom);
  const [, setRefined] = useAtom(refinedAtom);
  const [, setIsIELTSMode] = useAtom(isIELTSModeAtom);
  const [, setIeltsFeedback] = useAtom(ieltsFeedbackAtom);

  return async function refine() {
    if (text.trim().length === 0) {
      setRefined("");
      setResult([]);
      setIsIELTSMode(false);
      setIeltsFeedback(null);
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

    // For IELTS mode, parse JSON and store structured feedback
    // For regular mode, use diff view
    if (!isIELTS) {
      setResult(compareStrings(text, localRefined));
      setIeltsFeedback(null);
    } else {
      try {
        const feedbackData: IELTSFeedback = JSON.parse(localRefined);
        setIeltsFeedback(feedbackData);
        setResult([]);
      } catch (error) {
        console.error("Failed to parse IELTS feedback JSON:", error);
        // Fallback to showing raw text
        setResult([]);
      }
    }
    setLoading(false);
  };
}
